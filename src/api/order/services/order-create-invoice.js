'use strict';

const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

const _ = require('lodash');
const { env } = require('process');

const fs = require("fs");
const emailTemplate = fs.readFileSync('./data/template/template-order-is-delivering.html', "utf8");

const sendOrderIsDeliveringMail = async (id) => {

  const order = await strapi.entityService.findOne('api::order.order', id, {
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
      'delivery_method',
    ],
  });
  
  const orderCustomerName = order.receive_address
    ? `${order.receive_address.name.firstname} ${order.receive_address.name.lastname}`
    : '';
  const orderCustomerPhone = order.receive_address
    ? `${order.receive_address.phone}`
    : '';
  const orderAddress = order.receive_address
    ? `${order.receive_address.address.address}, ${order.receive_address.address.address_three_levels.ward}, ${order.receive_address.address.address_three_levels.district}, ${order.receive_address.address.address_three_levels.city}`
    : '';

  const subject = _.template(`Đơn hàng ORDER#<%= ORDER_ID %> đang vận chuyển`)({ ORDER_ID: order.id });
  const message = _.template(emailTemplate)({
    CUSTOMER_NAME: orderCustomerName,
    ORDER_CODE: `ORDER#${order.id}`,
    PAYMENT_METHOD: '',
    CUSTOMER_ADDRESS: orderAddress,
    CUSTOMER_PHONE: orderCustomerPhone,
    PRODUCTS: order.products,
    ORDER_TOTAL: order.products.reduce((sum, _) => {
      return sum + 0.01 * _.length * _.inventory_item.sku_quantity.sku.price
    }, 0),
    DELIVERY_COST: order.delivery_method.amount,
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
  async create(id, user) {
    await strapi.service('api::order.order-utils').createOrderInvoiceFromOrder(id);
    await strapi.service('api::order.order-utils').createOrderStatus(id, 'delivery');
    await sendOrderIsDeliveringMail(id);
  }
});