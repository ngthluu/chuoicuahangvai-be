'use strict';

module.exports = {
  exportAll: async (ctx, next) => {

    const { filters, populate } = ctx.query;

    const data = await strapi
      .entityService
      .findMany('api::refund.refund', {
        filters: filters,
        populate: populate,
      });

    const headers = {
      id: 'ID',
      invoice_id: 'Hóa đơn',
      branch_name: 'Cửa hàng',
      member_email: 'Khách hàng',
      create_date: 'Ngày tạo',
      status: 'Trạng thái',
    }

    const dataset = data.map((item) => {
      return {
        id: `REFUND#${item.id}`,
        invoice_id: item.refund_invoice ? `R-INVOICE#${item.refund_invoice.id}` : '',
        branch_name: item.branch ? item.branch.name : '',
        member_email: item.customer ? item.customer.email : '',
        create_date: item.createdAt,
        status: item.refund_statuses.sort((a, b) => Date.parse(a.createdAt) < Date.parse(b.createdAt) ? 1 : -1)[0].update_status
          ? 'Đã xác nhận và nhập kho'
          : 'Chưa xác nhận',
      }
    });
      
    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  }
};
