module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/order-cancel/:id',
      handler: 'order-cancel.cancel',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  