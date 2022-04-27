'use strict';

const processOrdersData = (orders) => {
  return orders.map((item) => {
    return {
      code: `ORDER#${item.id}`,
      ...item,
    }
  });
}

const getOrdersOfUser = async (userId, orderId=null) => {
  let userData = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
    populate: [
      'orders',
      'orders.order_statuses',
      'orders.receive_address',
      'orders.receive_address.address_three_levels',
      'orders.products',
      'orders.products.inventory_item',
      'orders.products.inventory_item.sku_quantity',
      'orders.products.inventory_item.sku_quantity.sku',
      'orders.products.inventory_item.sku_quantity.sku.product',
      
    ],
  });
  if (orderId) {
    userData.orders = userData.orders.filter((item) => item.id == orderId);
  }
  return processOrdersData(userData.orders);
}

module.exports = () => ({
    async getOrders(userId) {
      const orders = await getOrdersOfUser(userId);
      return orders;
    },

    async getOrderById(userId, orderId) {
      const orders = await getOrdersOfUser(userId, orderId);
      return orders;
    },
});
