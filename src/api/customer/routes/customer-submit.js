module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/customer/submit/:id',
       handler: 'customer-submit.changeStatus',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  