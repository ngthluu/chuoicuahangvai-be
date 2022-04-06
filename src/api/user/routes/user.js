module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/user',
     handler: 'user.find',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
      method: 'GET',
      path: '/user/:id',
      handler: 'user.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/user',
      handler: 'user.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
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
