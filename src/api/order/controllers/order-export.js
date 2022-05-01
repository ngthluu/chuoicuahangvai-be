'use strict';

module.exports = {
  exportAll: async (ctx, next) => {

    const { filters, populate } = ctx.query;

    const data = await strapi
      .entityService
      .findMany('api::order.order', {
        filters: filters,
        populate: populate,
      });

    const headers = {
      id: 'ID',
      invoice_id: 'Hóa đơn',
      branch_name: 'Chi nhánh',
      member_email: 'Khách hàng',
      create_date: 'Ngày đặt',
      status: 'Trạng thái',
      total_amount: 'Giá trị (đ)',
      paid_amount: 'Đã thanh toán (đ)',
      debt_amount: 'Nợ (đ)',
    }

    const dataset = [];
      
    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  }
};
