module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/warehouse-catalogues/submit/:id',
       handler: 'warehouse-catalogue-submit.submitCatalogue',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  