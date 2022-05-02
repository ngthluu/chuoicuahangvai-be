'use strict';

/**
 * A set of functions called "actions" for `users`
 */

module.exports = {
  getSchedules: async (ctx, next) => {
    const { filters } = ctx.query
    const data = await strapi.service('api::user.user-schedule').getSchedules(filters);
    ctx.body = data;
  },
};
