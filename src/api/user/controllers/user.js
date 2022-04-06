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

  create: async (ctx, next) => {
    try {
      const { data } = ctx.request.body;
      await strapi.service('api::user.user-create').create(data); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },

  update: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;
      await strapi.service('api::user.user-update').update(id, data); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },

};
