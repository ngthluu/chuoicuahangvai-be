module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/warehouse-inventory-export',
      handler: 'warehouse-inventory-export.exportAll',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  