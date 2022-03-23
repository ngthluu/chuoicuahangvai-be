'use strict';

/**
 * A set of functions called "actions" for `product-delete`
 */

module.exports = {
  deleteProductById: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      await strapi.service('api::product.product-delete').deleteProductWithSKU(id);
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
