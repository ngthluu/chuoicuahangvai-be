'use strict';

module.exports = {
  create: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      await strapi.service('api::order.order-create-invoice').create(id, user); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
