module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/statistics-revenue-export',
      handler: 'statistics.exportRevenue',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/statistics-soldvolume-export',
      handler: 'statistics.exportSoldVolume',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/statistics-customer-export',
      handler: 'statistics.exportCustomer',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
