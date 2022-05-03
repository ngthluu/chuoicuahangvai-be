module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/refunds-export',
      handler: 'refund-export.exportAll',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  