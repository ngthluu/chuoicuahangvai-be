'use strict';

module.exports = {
  getInvoiceById: async (ctx, next) => {
    const { id } = ctx.params;
    const receiveAddress = await strapi.service('api::customer.customer-invoices').getInvoiceById(id);
    ctx.body = receiveAddress;
  },
};
