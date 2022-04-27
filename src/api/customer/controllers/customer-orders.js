'use strict';

module.exports = {
  getOrders: async (ctx, next) => {
    try {
      const { user } = ctx.state;
      const ordersList = await strapi.service('api::customer.customer-orders').getOrders(user.id);
      ctx.body = ordersList;
    } catch (err) {
      ctx.body = err;
    }
  },
  getOrderById: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      const receiveAddress = await strapi.service('api::customer.customer-orders').getOrderById(user.id, id);
      ctx.body = receiveAddress;
    } catch (err) {
      ctx.body = err;
    }
  },
};
