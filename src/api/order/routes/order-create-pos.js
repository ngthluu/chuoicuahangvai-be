module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/orders/create-pos',
       handler: 'order-create-pos.createPos',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  