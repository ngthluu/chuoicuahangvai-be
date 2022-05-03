module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/order-print-invoice/:id',
      handler: 'order-print-invoice.print',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  