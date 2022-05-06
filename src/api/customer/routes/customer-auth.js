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
    {
      method: 'POST',
      path: '/auth/login',
      handler: 'customer-auth.login',
      config: {
        middlewares: ['plugin::users-permissions.rateLimit'],
        prefix: '',
      },
    },
    {
      method: 'POST',
      path: '/auth/forgotpassword',
      handler: 'customer-auth.forgotPassword',
      config: {
        middlewares: ['plugin::users-permissions.rateLimit'],
        prefix: '',
      },
    },
    {
      method: 'POST',
      path: '/auth/resetpassword',
      handler: 'customer-auth.resetPassword',
      config: {
        middlewares: ['plugin::users-permissions.rateLimit'],
        prefix: '',
      },
    },
    {
      method: 'POST',
      path: '/auth/register-confirmation',
      handler: 'customer-auth.registerConfirm',
      config: {
        middlewares: ['plugin::users-permissions.rateLimit'],
        prefix: '',
      },
    },
  ]
};
  