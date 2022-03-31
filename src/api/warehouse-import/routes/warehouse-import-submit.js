module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/warehouse-imports/submit/:id',
       handler: 'warehouse-import-submit.submitImport',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  