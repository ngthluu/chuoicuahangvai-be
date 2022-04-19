module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/refunds/submit/:id',
       handler: 'refund-submit.submitRefund',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  