'use strict';

/**
 * A set of functions called "actions" for `warehouse-import-submit`
 */

module.exports = {
  exportAll: async (ctx, next) => {

    const { filters } = ctx.query;

    const data = await strapi
      .entityService
      .findMany('api::warehouse-inventory.warehouse-inventory', {
        filters: filters,
        populate: [
          'sku_quantity',
          'sku_quantity.sku',
          'sku_quantity.sku.product',
          'sku_quantity.sku.color',
          'sku_quantity.sku.pattern',
          'sku_quantity.sku.stretch',
          'sku_quantity.sku.width',
          'sku_quantity.sku.origin',
        ],
      });

    const headers = {
      id: 'ID trong kho',
      product_code: 'Mã sản phẩm',
      product_name: 'Tên sản phẩm',
      length: 'Chiều dài còn lại (cm)',
      lastest_update_time: 'Thời gian cập nhật',
    }

    const dataset = data.map((item) => {
      return {
        id: `#${item.id}`,
        product_code: item.sku_quantity.sku.sku,
        product_name: item.sku_quantity.sku.product.name,
        length: item.sku_quantity.length,
        lastest_update_time: item.updatedAt,
      }
    });
      
    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  }
};
