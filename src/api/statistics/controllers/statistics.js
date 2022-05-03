'use strict';

/**
 * A set of functions called "actions" for `statistics`
 */

module.exports = {
  exportRevenue: async (ctx, next) => {
    const { filters } = ctx.query;

    const data = await strapi
      .entityService
      .findMany('api::order-invoice.order-invoice', {
        filters: filters,
        populate: ['order', 'customer_name', 'products', 'order_payment_invoices'],
      });

    const headers = {
      invoice_id: 'Hóa đơn',
      date: 'Ngày đặt',
      total: 'Giá trị',
      revenue: 'Đã thanh toán',
      debt: 'Nợ',
    }

    const dataset = data.map((item) => {
      return {
        invoice_id: `S-INVOICE#${item.id}`,
        date: new Date(item.createdAt).toISOString().split('T')[0],
        total: item.price,
        revenue: item.order_payment_invoices.reduce((prev, cur) => prev + parseFloat(cur.amount), 0),
        debt: item.price - item.order_payment_invoices.reduce((prev, cur) => prev + parseFloat(cur.amount), 0),
      }
    });
      
    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  },

  exportSoldVolume: async (ctx, next) => {
    const { filters } = ctx.query;

    const data = await strapi
      .entityService
      .findMany('api::order-invoice.order-invoice', {
        filters: filters,
        populate: [
          'order',
          'customer_name',
          'products',
          'products.inventory_item',
          'products.inventory_item.sku_quantity',
          'products.inventory_item.sku_quantity.sku',
          'products.inventory_item.sku_quantity.sku.product',
          'products.inventory_item.sku_quantity.sku.images',
          'products.inventory_item.sku_quantity.sku.pattern',
          'products.inventory_item.sku_quantity.sku.stretch',
          'products.inventory_item.sku_quantity.sku.width',
          'products.inventory_item.sku_quantity.sku.origin',
          'products.inventory_item.sku_quantity.sku.color',
          'order_payment_invoices',
        ],
      });

    let products = {}
    data.forEach((itemInvoice) => {
      const invoiceProducts = itemInvoice.products
      invoiceProducts.forEach((itemProduct) => {
        const length = itemProduct.length
        const inventoryItem = itemProduct.inventory_item
        const skuQuantityItem = inventoryItem.sku_quantity
        const skuItem = skuQuantityItem.sku
        if (products.hasOwnProperty(skuItem.id)) {
          products[skuItem.id].length += length
        } else {
          products[skuItem.id] = {
            skuItem: skuItem,
            length: length,
          }
        }
      })
    })

    const headers = {
      product_code: 'Mã SP',
      product_name: 'Tên SP',
      length: 'Chiều dài đã bán',
    }

    const dataset = Object.entries(products).map(([key, item]) => {
      return {
        product_code: item.skuItem.sku,
        product_name: item.skuItem.product.name,
        length: item.length,
      }
    });
      
    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  },

  exportCustomer: async (ctx, next) => {
    const { filters } = ctx.query;

    const data = await strapi
      .service('api::customer.customer')
      .fetchAll(filters, []);
    
    const customersData = data.map((item) => {
      return { date: new Date(item.createdAt).toISOString().split('T')[0] }
    });

    const headers = {
      date: 'Ngày',
      register_count: 'Số lượt đăng ký',
    }

    const dataset = Object
      .entries(customersData.reduce((prev, cur) => {
        if (Object.keys(prev).includes(cur.date)) return prev
        prev[cur.date] = {
          total: customersData.filter((g) => g.date === cur.date).reduce((p, c) => p + 1, 0),
        }
        return prev
      }, {}))
      .map(([date, count]) => ({
        date: date,
        register_count: count.total,
      }));

    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  },
};
