'use strict';

module.exports = {
  exportAll: async (ctx, next) => {

    const { filters } = ctx.query;

    const data = await strapi
      .entityService
      .findMany('api::order-payment-vnpay.order-payment-vnpay', {
        filters: filters,
        populate: ['orders'],
      });

    const headers = {
      transaction_code: 'Mã giao dịch',
      total_amount: 'Giá trị',
      orders: 'Đơn hàng',
    }

    const dataset = data.map((item) => {
      return {
        transaction_code: item.transaction_code,
        total_amount: item.amount,
        orders: item.orders.map((_) => `${_.type.toUpperCase()}#${_.id}`).join(', '),
      }
    });
      
    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  }
};
