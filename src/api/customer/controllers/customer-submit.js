'use strict';

/**
 * A set of functions called "actions" for `warehouse-catalogue-submit`
 */

module.exports = {
  changeStatus: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      await strapi.service('api::customer.customer-submit').changeStatus(id); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
