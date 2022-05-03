'use strict';

module.exports = {
  cancel: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      await strapi.service('api::order.order-cancel').cancel(id); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
