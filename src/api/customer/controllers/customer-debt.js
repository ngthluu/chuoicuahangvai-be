'use strict';

/**
 * A set of functions called "actions" for `warehouse-catalogue-submit`
 */

module.exports = {
  updateDebt: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;
      const { user } = ctx.state;
      await strapi.service('api::customer.customer-debt').updateDebt(id, data, user); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
