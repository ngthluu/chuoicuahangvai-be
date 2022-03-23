module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/products',
       handler: 'product-create.createProduct',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  