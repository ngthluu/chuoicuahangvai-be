'use strict';

/**
 * A set of functions called "actions" for `users`
 */

module.exports = {
  create: async (ctx, next) => {
    try {
      const { data } = ctx.request.body;
      strapi.log.info(JSON.stringify(data));
      await strapi.service('api::user.user-create').create(data); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },
};
