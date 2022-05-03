module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/refund-print-invoice/:id',
      handler: 'refund-print-invoice.print',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  