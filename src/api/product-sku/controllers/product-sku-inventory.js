'use strict';

const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

module.exports = {
    getProductByIdWithInventory: async (ctx, next) => {
    const { id } = ctx.params;
    const data = await strapi.service('api::product-sku.product-sku-inventory').getProductByIdWithInventory(id);
    if (!data) {
        throw new ApplicationError('Product is not exist');
    }
    ctx.body = data;
  }
};
