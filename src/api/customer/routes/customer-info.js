module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/customer-info',
      handler: 'customer-info.getInfo',
      config: {
        middlewares: [],
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/customer-info',
      handler: 'customer-info.updateInfo',
      config: {
        middlewares: [],
        policies: [],
      },
    },
  ]
};
  