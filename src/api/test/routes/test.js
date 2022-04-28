module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/test/email',
     handler: 'test.email',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
