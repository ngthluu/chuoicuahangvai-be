module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/user/login',
      handler: 'user-auth.login',
      config: {
        middlewares: ['plugin::users-permissions.rateLimit'],
        prefix: '',
      },
    },
  ]
};
    