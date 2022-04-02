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
  ],
};
