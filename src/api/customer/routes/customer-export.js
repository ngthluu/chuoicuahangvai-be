module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/customer-export',
      handler: 'customer-export.exportAll',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/customer-export-debt',
      handler: 'customer-export.exportAllDebt',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  