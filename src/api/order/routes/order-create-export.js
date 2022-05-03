module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/order-create-export/:id',
      handler: 'order-create-export.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  