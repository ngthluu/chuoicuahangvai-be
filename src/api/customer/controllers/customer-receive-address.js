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

  addReceiveAddress: async (ctx, next) => {
    try {
      const { user } = ctx.state;
      const { data } = ctx.request.body;
      await strapi.service('api::customer.customer-receive-address').addReceiveAddress(user.id, data);
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },

  updateReceiveAddress: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      const { data } = ctx.request.body;
      await strapi.service('api::customer.customer-receive-address').updateReceiveAddress(id, user.id, data);
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },

  deleteReceiveAddress: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      await strapi.service('api::customer.customer-receive-address').deleteReceiveAddress(id, user.id);
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },

};
