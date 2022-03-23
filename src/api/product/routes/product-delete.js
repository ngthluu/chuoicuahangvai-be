module.exports = {
    routes: [
      {
       method: 'DELETE',
       path: '/products/:id',
       handler: 'product-delete.deleteProductById',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  