'use strict';

/**
 * A set of functions called "actions" for `warehouse-export-submit`
 */

module.exports = {
  submitExport: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      await strapi.service('api::warehouse-export.warehouse-export-submit').submitExport(id, user.id); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
