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

  async processIPN(data) {
    if (!isValidReturnData(data)) return false;
    return true;
  }
});
