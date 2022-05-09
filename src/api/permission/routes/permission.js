module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/check-permission',
      handler: 'permission.checkPermission',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  