'use strict';

/**
 * A set of functions called "actions" for `customer`
 */

module.exports = {
  find: async (ctx, next) => {
    const data = await strapi.service('api::customer.customer').fetchAll(ctx.query.filters, ctx.query.populate);
    ctx.body = { data: data };
  }
};
