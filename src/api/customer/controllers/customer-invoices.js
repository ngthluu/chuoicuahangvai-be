'use strict';

module.exports = {
  getInvoiceById: async (ctx, next) => {
    const { id } = ctx.params;
    const { user } = ctx.state;
    const receiveAddress = await strapi.service('api::customer.customer-invoices').getInvoiceById(user.id, id);
    ctx.body = receiveAddress;
  },
};
