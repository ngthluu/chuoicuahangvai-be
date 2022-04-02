module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/customer',
     handler: 'customer.find',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
      method: 'GET',
      path: '/customer/:id',
      handler: 'customer.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/customer/:id',
      handler: 'customer.deleteOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
