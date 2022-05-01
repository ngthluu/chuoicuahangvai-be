'use strict';

/**
 * A set of functions called "actions" for `statistics`
 */

module.exports = {
  exportRevenue: async (ctx, next) => {
    const { filters, populate } = ctx.query;

    const data = await strapi
      .entityService
      .findMany('api::order-invoice.order-invoice', {
        filters: filters,
        populate: populate,
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
    const { filters, populate } = ctx.query;

    const data = await strapi
      .service('api::customer.customer')
      .fetchAll(filters, populate);

    const headers = {
      name: 'Họ và tên',
      phone: 'Số điện thoại',
      debt_amount: 'Số tiền nợ',
      status: 'Trạng thái',
    }

    const dataset = data.map((item) => {
      const debt_amount = item.orders.reduce((prev, cur) => {
        if (!cur.order_invoice) return 0
        return (
          prev +
          cur.order_invoice.price -
          cur.order_invoice.order_payment_invoices.reduce((prev1, cur1) => {
            return prev1 + parseInt(cur1.amount)
          }, 0)
        )
      }, 0);
      const status = debt_amount > 0 ? 'Đang nợ' : 'Thanh toán đủ';
      return {
        name: item.name ? `${item.name.firstname} ${item.name.lastname}` : '',
        phone: item.phone,
        debt_amount: debt_amount,
        status: status,
      }
    });
      
    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  },

  exportCustomer: async (ctx, next) => {
    const { filters, populate } = ctx.query;

    const data = await strapi
      .service('api::customer.customer')
      .fetchAll(filters, populate);

    const headers = {
      name: 'Họ và tên',
      phone: 'Số điện thoại',
      debt_amount: 'Số tiền nợ',
      status: 'Trạng thái',
    }

    const dataset = data.map((item) => {
      const debt_amount = item.orders.reduce((prev, cur) => {
        if (!cur.order_invoice) return 0
        return (
          prev +
          cur.order_invoice.price -
          cur.order_invoice.order_payment_invoices.reduce((prev1, cur1) => {
            return prev1 + parseInt(cur1.amount)
          }, 0)
        )
      }, 0);
      const status = debt_amount > 0 ? 'Đang nợ' : 'Thanh toán đủ';
      return {
        name: item.name ? `${item.name.firstname} ${item.name.lastname}` : '',
        phone: item.phone,
        debt_amount: debt_amount,
        status: status,
      }
    });
      
    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  },
};
