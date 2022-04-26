module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/receive-address',
      handler: 'customer-receive-address.getReceiveAddressList',
      config: {
        middlewares: [],
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/receive-address/:id',
      handler: 'customer-receive-address.getReceiveAddressById',
      config: {
        middlewares: [],
        policies: [],
      },
    },
  ]
};
  