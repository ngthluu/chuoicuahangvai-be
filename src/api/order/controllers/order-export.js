'use strict';

module.exports = {
  exportAll: async (ctx, next) => {

    const { filters } = ctx.query;

    const data = await strapi
      .entityService
      .findMany('api::order.order', {
        filters: filters,
        populate: [
          'customer',
          'branch',
          'order_invoice',
          'order_invoice.order_payment_invoices',
        ],
      });

    const headers = {
      id: 'ID',
      invoice_id: 'Hóa đơn',
      branch_name: 'Cửa hàng',
      member_email: 'Khách hàng',
      create_date: 'Ngày đặt',
      status: 'Trạng thái',
      total_amount: 'Giá trị (đ)',
      paid_amount: 'Đã thanh toán (đ)',
      debt_amount: 'Nợ (đ)',
    }

    const dataset = data.map((item) => {
      return {
        id: `${item.type.toUpperCase()}#${item.id}`,
        invoice_id: item.order_invoice ? `S-INVOICE#${item.order_invoice.id}` : '',
        branch_name: item.branch ? item.branch.name : '',
        member_email: item.customer ? item.customer.email : '',
        create_date: item.createdAt,
        status: item.current_status,
        total_amount: item.order_invoice
          ? item.order_invoice.price
          : 0,
        paid_amount: item.order_invoice
          ? item.order_invoice.order_payment_invoices.reduce(
            (prev, cur) => prev + parseFloat(cur.amount), 0
          ) 
          : 0,
        debt_amount: item.order_invoice
          ? item.order_invoice.price - item.order_invoice.order_payment_invoices.reduce(
            (prev, cur) => prev + parseFloat(cur.amount), 0
          )
          : 0,
      }
    });
      
    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  }
};
