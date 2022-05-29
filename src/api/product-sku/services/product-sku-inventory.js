'use strict';

module.exports = () => ({
  async getProductByIdWithInventory(id) {
    const productSku = await strapi.entityService.findOne('api::product-sku.product-sku', id, {
      populate: ['product', 'pattern', 'stretch', 'width', 'origin', 'color', 'images'],
    });

    if (!productSku) return null;

    const inventories = await strapi.entityService.findMany('api::warehouse-inventory.warehouse-inventory', {
      filters: { 
        sku_quantity: { sku: { id: productSku.id } }, 
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
    const inventoryLength = inventories.reduce((sum, _) => sum + _.sku_quantity.length, 0);

    return {...productSku, inventoryLength};
  }
});
