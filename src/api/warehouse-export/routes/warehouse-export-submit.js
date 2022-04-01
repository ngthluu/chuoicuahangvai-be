module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/warehouse-exports/submit/:id',
       handler: 'warehouse-export-submit.submitExport',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  