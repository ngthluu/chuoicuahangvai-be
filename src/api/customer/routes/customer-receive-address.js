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
    {
      method: 'POST',
      path: '/receive-address',
      handler: 'customer-receive-address.addReceiveAddress',
      config: {
        middlewares: [],
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/receive-address/:id',
      handler: 'customer-receive-address.updateReceiveAddress',
      config: {
        middlewares: [],
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/receive-address/:id',
      handler: 'customer-receive-address.deleteReceiveAddress',
      config: {
        middlewares: [],
        policies: [],
      },
    },
  ]
};
  