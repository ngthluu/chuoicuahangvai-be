module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/product-sku-inventory/:id',
      handler: 'product-sku-inventory.getProductByIdWithInventory',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
    