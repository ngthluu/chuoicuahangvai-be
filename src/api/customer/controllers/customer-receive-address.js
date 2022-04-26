'use strict';

module.exports = {
  getReceiveAddressList: async (ctx, next) => {
    try {
      const { user } = ctx.state;
      const receiveAddressList = await strapi.service('api::customer.customer-receive-address').getReceiveAddressList(user.id);
      ctx.body = receiveAddressList;
    } catch (err) {
      ctx.body = err;
    }
  },
  getReceiveAddressById: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      const receiveAddress = await strapi.service('api::customer.customer-receive-address').getReceiveAddressById(user.id, id);
      ctx.body = receiveAddress;
    } catch (err) {
      ctx.body = err;
    }
  },
};
