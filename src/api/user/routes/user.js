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
  ],
};
