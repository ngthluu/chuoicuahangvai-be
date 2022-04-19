'use strict';

/**
 * A set of functions called "actions" for `warehouse-import-submit`
 */

module.exports = {
  createRefund: async (ctx, next) => {
    try {
      const { data } = ctx.request.body;
      const { user } = ctx.state;
      await strapi.service('api::refund.refund-create').createRefund(user, data); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
