module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/register',
      handler: 'customer-auth.register',
      config: {
        middlewares: ['plugin::users-permissions.rateLimit'],
        prefix: '',
      },
    },
  ]
};
  