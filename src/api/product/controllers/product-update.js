'use strict';

/**
 * A set of functions called "actions" for `product-update`
 */

module.exports = {
  updateProduct: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;
      await strapi.service('api::product.product-update').updateProductWithSKU(id, data); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
