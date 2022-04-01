'use strict';

/**
 * A set of functions called "actions" for `warehouse-catalogue-submit`
 */

module.exports = {
  submitCatalogue: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      await strapi.service('api::warehouse-catalogue.warehouse-catalogue-submit').submitCatalogue(id, user.id); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
