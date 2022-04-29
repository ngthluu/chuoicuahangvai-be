'use strict';

/**
 * A set of functions called "actions" for `users`
 */

module.exports = {
  find: async (ctx, next) => {
    const data = await strapi.service('api::user.user').fetchAll(ctx.query.filters, ctx.query.populate);
    ctx.body = { data: data };
  },

  findOne: async (ctx, next) => {
    const { id } = ctx.params
    const data = await strapi.service('api::user.user').fetchOne(id, ctx.query.filters, ctx.query.populate);
    ctx.body = { data: data };
  },
  getRoles: async (ctx, next) => {
    const data = await strapi.service('api::user.user').getRoles();
    ctx.body = data;
  }
};
