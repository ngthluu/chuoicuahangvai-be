'use strict';

module.exports = () => ({
  async create(id, user) {
    await strapi.service('api::order.order-utils').createOrderInvoiceFromOrder(id);
    await strapi.service('api::order.order-utils').createOrderStatus(id, 'delivery');
  }
});