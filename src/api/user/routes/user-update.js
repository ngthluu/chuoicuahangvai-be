module.exports = {
    routes: [
      {
        method: 'PUT',
        path: '/user/:id',
        handler: 'user.update',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  