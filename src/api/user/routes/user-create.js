module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/user',
        handler: 'user-create.create',
        config: {
          policies: [],
          middlewares: ['global::auth-branch-body'],
        },
      },
    ],
  };
  