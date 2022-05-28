module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/user',
     handler: 'user.find',
     config: {
       policies: [],
       middlewares: ['global::auth-branch-query'],
     },
    },
    {
      method: 'GET',
      path: '/user/:id',
      handler: 'user.findOne',
      config: {
        policies: [],
        middlewares: ['global::auth-branch-query'],
      },
    },
    {
      method: 'GET',
      path: '/user-roles',
      handler: 'user.getRoles',
      config: {
        policies: [],
        middlewares: [],
      },
     },
    {
      method: 'POST',
      path: '/user-reset-password',
      handler: 'user.resetPassword',
      config: {
        policies: [],
        middlewares: ['global::auth-branch-query'],
      },
    },
    {
      method: 'POST',
      path: '/user-reset-password/:id',
      handler: 'user.resetPasswordForUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
