module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/customer-reset-password',
      handler: 'customer-password.resetPassword',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  