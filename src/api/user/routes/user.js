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
      method: 'GET',
      path: '/user-roles',
      handler: 'user.getRoles',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
