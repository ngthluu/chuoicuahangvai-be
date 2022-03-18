'use strict';

/**
 * A set of functions called "actions" for `users`
 */

module.exports = {
  find: async (ctx, next) => {
    const data = await strapi.service('api::user.user').fetchAll(ctx.query.filters, ctx.query.populate);
    ctx.body = { data: data };
  }
};
