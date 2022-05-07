'use strict';

const utils = require('@strapi/utils');
const { ValidationError, ApplicationError } = utils.errors;
const _ = require('lodash');
const { env } = require('process');

const { yup, validateYupSchema } = require('@strapi/utils');
const validateSchema = yup.object().shape({
  skus: yup.array().required().of(
    yup.object().shape({
      id: yup.number().required(),
      length: yup.number().required(),
    })
  ),
  note: yup.string(),
  isDebt: yup.boolean().required(),
  deliveryInfo: yup.object().required().shape({
    email: yup.string().email().required(),
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    address: yup.string().required(),
    wardId: yup.number().required(),
    phone: yup.string().required(),
  }),
  deliveryMethod: yup.object().required().shape({
    id: yup.number().required(),
  }),
  paymentType: yup.string().required().oneOf(['cod', 'online']),
});

const groupBy = (x, f) => {
  let result = {};
  for (const item of x) {
    if (result.hasOwnProperty(f(item))) {
      result[f(item)].push(item);
    } else {
      result[f(item)] = [item];
    }
  }
  return result;
}

const fs = require("fs");
const emailTemplate = fs.readFileSync('./data/template/template-checkout-initialize.html', "utf8");

const sendOrderConfirmationMail = async (order) => {
  
  const orderCustomerName = order.receive_address
    ? `${order.receive_address.name.firstname} ${order.receive_address.name.lastname}`
    : '';
  const orderCustomerPhone = order.receive_address
    ? `${order.receive_address.phone}`
    : '';
  const orderAddress = order.receive_address
    ? `${order.receive_address.address.address}, ${order.receive_address.address.address_three_levels.ward}, ${order.receive_address.address.address_three_levels.district}, ${order.receive_address.address.address_three_levels.city}`
    : '';


  const subject = _.template(`Xác nhận đơn hàng ORDER#<%= ORDER_ID %>`)({ ORDER_ID: order.id });
  const message = _.template(emailTemplate)({
    CUSTOMER_NAME: orderCustomerName,
    ORDER_CODE: `ORDER#${order.id}`,
    PAYMENT_METHOD: '',
    CUSTOMER_ADDRESS: orderAddress,
    CUSTOMER_EMAIL: order.customer.email,
    CUSTOMER_PHONE: orderCustomerPhone,
    PRODUCTS: order.products,
    ORDER_TOTAL: order.products.reduce((sum, _) => {
      return sum + 0.01 * _.length * _.inventory_item.sku_quantity.sku.price
    }, 0),
  });

  try {
    await strapi
      .plugin('email')
      .service('email')
      .send({
        to: order.customer.email,
        from: `${env.SMTP_DEFAULT_NAME} <${env.SMTP_DEFAULT_FROM}>`,
        replyTo: order.customer.email,
        subject: subject,
        text: message,
        html: message,
      });
  } catch (err) {
    throw new ApplicationError(err.message);
  }
}

module.exports = () => ({

  async getSuitableInventoryItems(skus) {
    const cartItemIds = skus.map((item) => item.id);
    const inventories = await strapi.entityService.findMany('api::warehouse-inventory.warehouse-inventory', {
      sort: ['createdAt:asc'],
      filters: { 
        sku_quantity: {
          sku: {
            id: { $in: cartItemIds },
          },
        }, 
      },
      populate: [
        'sku_quantity',
        'sku_quantity.sku',
        'branch',
      ],
    });
    const chooseItems = skus
    .map((item) => {
      const inventoriesWithSku = inventories.filter((item2) => {
        return item2.sku_quantity.sku.id == item.id;
      });
      let data = [];
      for (const inventoryWithSkuItem of inventoriesWithSku) {
        const inventoryWithSkuItemLength = inventoryWithSkuItem.sku_quantity.length;
        item.length -= inventoryWithSkuItemLength;
        if (item.length < 0) {
          data.push({...inventoryWithSkuItem, length: item.length + inventoryWithSkuItemLength});
          break;
        } else {
          data.push({...inventoryWithSkuItem, length: inventoryWithSkuItemLength});
        }
      }
      return data;
    })
    .flat();

    return Object
    .entries(groupBy(chooseItems, (item) => item.branch.id))
    .map(([branchId, inventoryItems]) => {
      return {
        branch: branchId,
        products: inventoryItems.map((item) => {
          return {
            inventory_item: item.id,
            length: item.length,
          }
        }),
      }
    });
  },

  async process(user, request) {

    const data = request.body;

    await validateYupSchema(validateSchema)(data);
    
    let { note, isDebt, deliveryInfo, deliveryMethod, paymentType } = data;
    const { skus, price } = await strapi.service('api::cart.cart-step-cart').process(user, data);

    const deliveryMethods = await strapi.service('api::cart.cart-step-delivery').getDeliveryMethods(); 
    const realDeliveryMethod = deliveryMethods.filter((item) => item.id == deliveryMethod.id);
    if (realDeliveryMethod.length == 0) {
      throw new ValidationError('Invalid delivery method');
    }
    const totalPrice = price + realDeliveryMethod[0].cost;

    let orderData = {
        type: paymentType,
        receive_address: {
            name: {
                firstname: deliveryInfo.firstname,
                lastname: deliveryInfo.lastname,
            },
            address: {
                address: deliveryInfo.address,
                address_three_levels: deliveryInfo.wardId,
            },
            phone: deliveryInfo.phone,
        },
        note: note,
    }
    if (user) {
        orderData =  { ...orderData, customer: user.id  };
    } else {
        const customerData = await strapi
        .service('api::customer.customer-create')
        .createAnonymousWithEmail({
            firstName: deliveryInfo.firstname,
            lastName: deliveryInfo.lastname,
            phone: deliveryInfo.phone,
            email: deliveryInfo.email,
        });
        orderData =  {...orderData, customer: customerData.id  };
    }

    const items = await this.getSuitableInventoryItems(skus);
    let orderIds = [];
    for (const item of items) {
      const order = await strapi.service('api::order.order').create({
        data: { ...orderData, ...item },
        populate: [
          'receive_address',
          'receive_address.name',
          'receive_address.address',
          'receive_address.address.address_three_levels',
          'customer',
          'customer.name',
          'products',
          'products.inventory_item',
          'products.inventory_item.sku_quantity',
          'products.inventory_item.sku_quantity.sku',
          'products.inventory_item.sku_quantity.sku.product',
          'products.inventory_item.sku_quantity.sku.color',
          'products.inventory_item.sku_quantity.sku.pattern',
          'products.inventory_item.sku_quantity.sku.stretch',
          'products.inventory_item.sku_quantity.sku.width',
          'products.inventory_item.sku_quantity.sku.origin',
          'products.inventory_item.sku_quantity.sku.images',
        ]
      });
      orderIds.push(order.id);
      await sendOrderConfirmationMail(order);
      await strapi.service('api::order.order-utils').createOrderStatus(order.id, 'initialize');
    }
    // Online payment here
    if (!isDebt && paymentType === 'online') {
      const url = await strapi.service('api::cart.cart-vnpay').createPaymentUrl({
        request,
        orders: orderIds,
        totalAmount: totalPrice,
      });
      return { status: 'ok', url: url };
    }
    return { status: 'ok' };
  }
});
