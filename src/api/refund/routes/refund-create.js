module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/refunds/create',
       handler: 'refund-create.createRefund',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  