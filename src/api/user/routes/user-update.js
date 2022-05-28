module.exports = {
    routes: [
      {
        method: 'PUT',
        path: '/user/:id',
        handler: 'user-update.update',
        config: {
          policies: [],
          middlewares: ['global::auth-branch-body'],
        },
      },
    ],
  };
  