'use strict';

const { env } = require('process');
const querystring = require('qs');
const crypto = require('crypto');
const dateFormat = require('dateformat');

const sortObject = (obj) => {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const isValidReturnData = (data) => {
  let vnp_Params = data;
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  let secretKey = env.vnp_HashSecret;
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let signed = crypto
    .createHmac("sha512", secretKey)
    .update(new Buffer(signData, 'utf-8'))
    .digest("hex");
  return secureHash === signed;
}

module.exports = () => ({
async createPaymentUrl(data) {

    const { request, orders, totalAmount } = data;

    const ipAddr = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    
    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: env.vnp_TmnCode,
      vnp_Amount: totalAmount * 100,
      vnp_CreateDate: dateFormat(new Date(), 'yyyymmddHHmmss'),
      vnp_CurrCode: 'VND',
      vnp_IpAddr: ipAddr,
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Đặt đơn hàng ${JSON.stringify(orders)}`,
      vnp_ReturnUrl: env.vnp_ReturnUrl,
      vnp_TxnRef: JSON.stringify(orders),
    };

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let signed = crypto
      .createHmac("sha512", env.vnp_HashSecret)
      .update(new Buffer(signData, 'utf-8'))
      .digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    return env.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });
  },

  async processReturnUrl(data) {
    if (!isValidReturnData(data)) return false;
    
    const orderIds = JSON.parse(data['vnp_TxnRef']);
    if (orderIds.length === 0) return false;
    
    return data['vnp_ResponseCode'] === '00' || data['vnp_TransactionStatus'] === '00';
  },

  async processIPNUrl(data) {
    // Check checksum
    if (!isValidReturnData(data)) return '97';

    // Check is existed orders
    let orderIds = [];
    try {
      orderIds = JSON.parse(data['vnp_TxnRef']);
    } catch (e) {
      return '01';
    }
    if (orderIds.length === 0) return '01';
    const ordersList = await strapi.entityService.findMany('api::order.order', {
      filters: { id: { $in: orderIds } },
      populate: [
        'products',
        'products.inventory_item',
        'products.inventory_item.sku_quantity',
        'products.inventory_item.sku_quantity.sku',
        'delivery_method',
      ]
    });
    if (ordersList.length === 0 || ordersList.length !== orderIds.length) {
      return '01';
    }

    // Check total cost
    const vnp_Amount = parseInt(data['vnp_Amount']) / 100;
    const totalAmount = ordersList
      .map((item) => 
        item.products.reduce(
          (sum, _) => sum + 0.01 * _.length * _.inventory_item.sku_quantity.sku.price
          , item.delivery_method ? parseInt(item.delivery_method.amount) : 0
        )
      ).reduce((sum, _) => sum + parseInt(_), 0);
    if (totalAmount !== vnp_Amount) return '04';

    // Check paid yet
    const existedPayments = await strapi
      .entityService
      .findMany('api::order-payment-vnpay.order-payment-vnpay', {
        filters: { orders: { id: { $in: orderIds } } },
      })
    if (existedPayments.length > 0) {
      return '02';
    }
    if (data['vnp_ResponseCode'] === '00' || data['vnp_TransactionStatus'] === '00') {
      const payment = await strapi.entityService.create('api::order-payment-vnpay.order-payment-vnpay', {
        data: {
          transaction_code: data['vnp_TransactionNo'],
          amount: totalAmount,
        }
      });
      for (const id of orderIds) {
        await strapi.entityService.update('api::order.order', id, {
          data: {
            order_payment_vnpay: payment.id
          }
        })
      }
    } else {
      for (const id of orderIds) {
        await strapi.service('api::order.order-utils').createOrderStatus(id, 'canceled');
      }
    }
    return '00';
  },

  async getMessageFromRspCode(rspCode) {
    switch (rspCode) {
      case '00': return 'Confirm Success';
      case '01': return 'Order Not Found';
      case '02': return 'Order already confirmed';
      case '04': return 'Invalid amount';
      case '97': return 'Invalid Checksum';
      default: return '';
    }
  }
});
