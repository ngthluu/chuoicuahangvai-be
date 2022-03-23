module.exports = {
    routes: [
      {
       method: 'PUT',
       path: '/products/:id',
       handler: 'product-update.updateProduct',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  