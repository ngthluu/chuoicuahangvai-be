'use strict';

const utils = require('@strapi/utils');
const { ValidationError } = utils.errors;

const { yup, validateYupSchema } = require('@strapi/utils');
const validateSchema = yup.object().shape({
  cart: yup.array().of(
    yup.object().shape({
      id: yup.number().required(),
      length: yup.number().required(),
    })
  ),
});

module.exports = () => ({
  async process(data) {
    await validateYupSchema(validateSchema)(data);

    const { cart } = data;
    const cartItemIds = cart.map((item) => item.id);

    let skus = await strapi.entityService.findMany('api::product-sku.product-sku', {
      filters: { 
        id: { $in: cartItemIds }, 
      },
      populate: ['product', 'pattern', 'stretch', 'width', 'origin', 'color', 'images'],
    });

    const inventories = await strapi.entityService.findMany('api::warehouse-inventory.warehouse-inventory', {
      filters: { 
        sku_quantity: {
          sku: {
            id: { $in: cartItemIds },
          },
        }, 
      },
      populate: [
        'sku_quantity',
        'sku_quantity.sku',
        'sku_quantity.sku.product',
        'sku_quantity.sku.pattern',
        'sku_quantity.sku.stretch',
        'sku_quantity.sku.width',
        'sku_quantity.sku.origin',
        'sku_quantity.sku.color',
      ],
    });

    skus = skus.map((item) => {
      const inventoryLength = inventories
        .filter((_) => _.sku_quantity.sku.id == item.id)
        .reduce((sum, _) => sum + _.sku_quantity.length, 0);
      
      const inputDataLength = cart
        .filter((_) => _.id == item.id)
        .reduce((sum, _) => sum + _.length, 0);

      const length = inputDataLength < inventoryLength ? inputDataLength : 1;

      return { ...item, length, inventoryLength };
    });

    return skus;
  }
});
