'use strict';

const utils = require('@strapi/utils');
const { ValidationError } = utils.errors;

const { yup, validateYupSchema } = require('@strapi/utils');
const validateSchema = yup.object().shape({
  skus: yup.array().required().of(
    yup.object().shape({
      id: yup.number().required(),
      length: yup.number().required(),
    })
  ),
});

module.exports = () => ({
  async process(user, data) {
    await validateYupSchema(validateSchema)(data);

    const { skus } = data;

    if (skus.length == 0) {
      return {skus: [], price: 0, message: ['Giỏ hàng trống']};
    }

    const cartItemIds = skus.map((item) => item.id);

    let productSkus = await strapi.entityService.findMany('api::product-sku.product-sku', {
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

    let outOfInventoryMessages = [];
    let outOfStockMessages = [];

    productSkus = productSkus
    .map((item) => {
      const inventoryLength = inventories
        .filter((_) => _.sku_quantity.sku.id == item.id)
        .reduce((sum, _) => sum + _.sku_quantity.length, 0);
      
      const inputDataLength = skus
        .filter((_) => _.id == item.id)
        .reduce((sum, _) => sum + _.length, 0);

      if (inventoryLength == 0) {
        outOfStockMessages.push(`${item.product.name} (${item.sku})`);
      } else if (inputDataLength > inventoryLength) {
        outOfInventoryMessages.push(`${item.product.name} (${item.sku})`);
      }

      const length = inputDataLength <= inventoryLength ? inputDataLength : 0;
      return { ...item, length, inventoryLength };
    })
    .filter((item) => item.inventoryLength > 0)
    .filter((item) => item.length > 0);

    const price = productSkus.reduce((sum, _) => sum + _.price * _.length * 0.01, 0);
    let messages = [];
    if (outOfInventoryMessages.length > '') messages.push(`Sản phẩm ${outOfInventoryMessages.join(', ')} vượt quá số lượng trong kho`);
    if (outOfStockMessages.length > '') messages.push(`Sản phẩm ${outOfStockMessages.join(', ')} đã hết hàng`);

    return {
      skus: productSkus,
      price,
      message: messages,
    };
  }
});
