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
  ],
};
