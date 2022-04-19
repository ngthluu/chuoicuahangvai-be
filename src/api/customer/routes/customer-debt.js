module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/customer/debt/:id',
       handler: 'customer-debt.updateDebt',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  