'use strict';

/**
 * A set of functions called "actions" for `warehouse-import-submit`
 */

module.exports = {
  submitImport: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      await strapi.service('api::warehouse-import.warehouse-import-submit').submitImport(id, user.id); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
