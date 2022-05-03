module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/order-create-invoice/:id',
      handler: 'order-create-invoice.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  