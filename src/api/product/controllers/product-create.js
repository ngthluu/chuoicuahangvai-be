'use strict';

/**
 * A set of functions called "actions" for `product-create`
 */

module.exports = {
  createProduct: async (ctx, next) => {
    try {
      const { data } = ctx.request.body;
      await strapi.service('api::product.product-create').createProductWithSKU(data); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
