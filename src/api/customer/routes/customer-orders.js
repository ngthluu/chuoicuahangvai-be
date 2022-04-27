module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/customer-orders',
      handler: 'customer-orders.getOrders',
      config: {
        middlewares: [],
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/customer-orders/:id',
      handler: 'customer-orders.getOrderById',
      config: {
        middlewares: [],
        policies: [],
      },
    },
  ]
};
    