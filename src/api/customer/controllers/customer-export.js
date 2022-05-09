'use strict';

module.exports = {
  exportAll: async (ctx, next) => {

    const { filters } = ctx.query;

    const data = await strapi
      .service('api::customer.customer')
      .fetchAll(filters, ['name']);

    const headers = {
      id: 'ID',
      name: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      status: 'Trạng thái',
    }

    const dataset = data.map((item) => {
      const status = !item.blocked ? 'Đã đăng ký' : 'Vãng lai';
      return {
        id: `#${item.id}`,
        name: item.name ? `${item.name.firstname} ${item.name.lastname}` : '',
        email: item.email,
        phone: item.phone,
        status: status,
      }
    });
      
    await strapi.service('api::export-excel.export-excel').exportExcel(ctx, headers, dataset);
  },
  exportAllDebt: async (ctx, next) => {

    const { filters } = ctx.query;

    const data = await strapi
      .service('api::customer.customer')
      .fetchAll(filters, [
        'name',
        'orders',
        'orders.order_invoice',
        'orders.order_invoice.order_payment_invoices',
      ]);

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
  }
};
