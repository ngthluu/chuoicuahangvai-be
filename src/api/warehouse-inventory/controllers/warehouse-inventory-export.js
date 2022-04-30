'use strict';

/**
 * A set of functions called "actions" for `warehouse-import-submit`
 */

module.exports = {
  exportAll: async (ctx, next) => {
    await strapi.service('api::export-excel.export-excel').exportExcel(
      ctx,
      'Report-inventory.xlsx',
      { 
        customer_name: 'Customer name',
        age: 'Age'
      },
      [
        { customer_name: 'Nguyen Van B', age: 12, },
        { customer_name: 'Nguyen Van A', age: 13, },
      ]
    )
  }
};
