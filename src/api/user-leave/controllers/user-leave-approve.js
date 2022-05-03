'use strict';

module.exports = {
  approve: async (ctx, next) => {
    const { id } = ctx.params;
    const { user } = ctx.state;
    const data = await strapi.service('api::user-leave.user-leave-approve').approve(id, user);
    ctx.body = data;
  }
};
