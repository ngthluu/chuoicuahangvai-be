'use strict';

/**
 * A set of functions called "actions" for `users`
 */

module.exports = {
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
