'use strict';

/**
 * A set of functions called "actions" for `warehouse-import-submit`
 */

module.exports = {
  createPos: async (ctx, next) => {
    try {
      const { data } = ctx.request.body;
      const { user } = ctx.state;
      await strapi.service('api::order.order-create-pos').createPos(user, data); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
