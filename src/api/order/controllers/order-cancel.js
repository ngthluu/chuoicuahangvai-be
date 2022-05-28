'use strict';

module.exports = {
  cancel: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      await strapi.service('api::order.order-cancel').cancel(id, user.id); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
