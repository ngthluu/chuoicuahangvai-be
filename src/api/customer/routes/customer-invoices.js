module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/customer-invoices/:id',
      handler: 'customer-invoices.getInvoiceById',
      config: {
        middlewares: [],
        policies: [],
      },
    },
  ]
};
    