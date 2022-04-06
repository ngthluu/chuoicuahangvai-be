module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/user',
        handler: 'user.create',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  