module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/order-payment-vnpays-export',
      handler: 'order-payment-vnpays-export.exportAll',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  