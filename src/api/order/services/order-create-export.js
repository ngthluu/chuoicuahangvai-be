'use strict';

module.exports = () => ({
  async create(id, user) {
    const order = await strapi.entityService.findOne('api::order.order', id, {
      populate: ['products', 'products.inventory_item', 'branch'],
    });
    await strapi.entityService.create('api::warehouse-export.warehouse-export', {
      data: {
        order: order.id,
        products: order.products.map((item) => ({
          inventory_item: item.inventory_item.id,
          length: item.length,
        })),
        branch: order.branch.id,
      }
    });
    await strapi.service('api::order.order-utils').createOrderStatus(id, 'confirmed');
  }
});