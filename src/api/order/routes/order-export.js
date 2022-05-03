module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/orders-export',
      handler: 'order-export.exportAll',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  