'use strict';

const processOrdersData = (orders) => {
  return orders.filter((item) => {
    return item.type != "pos";
  }).map((item) => {
    let orderAmount = item.products.reduce((sum, _) => sum + parseInt(_.unit_price) * parseInt(_.length) * 0.01, 0);
    if (item.delivery_method) orderAmount += parseInt(item.delivery_method.amount);
    if (item.discount_value) orderAmount -= parseInt(item.discount_value);
    return {
      code: `ORDER#${item.id}`,
      orderAmount: orderAmount,
      invoiceAmount: item.order_invoice ? item.order_invoice.price : 0,
      ...item,
    }
  });
}

const getOrdersOfUser = async (userId) => {
  let orders = await strapi.entityService.findMany('api::order.order', {
    filters: {
      customer: { id: userId }
    },
    populate: [
      'order_invoice',
      'receive_address',
      'receive_address.name',
      'receive_address.address',
      'receive_address.address.address_three_levels',
      'products',
      'products.inventory_item',
      'products.inventory_item.sku_quantity',
      'products.inventory_item.sku_quantity.sku',
      'products.inventory_item.sku_quantity.sku.product',
      'products.inventory_item.sku_quantity.sku.images',
      'products.inventory_item.sku_quantity.sku.pattern',
      'products.inventory_item.sku_quantity.sku.stretch',
      'products.inventory_item.sku_quantity.sku.width',
      'products.inventory_item.sku_quantity.sku.origin',
      'products.inventory_item.sku_quantity.sku.color',
      'delivery_method',
    ],
  })
  return processOrdersData(orders);
}

const getOrderOfUserById = async (userId, orderId) => {
  let orderData = await strapi.entityService.findOne('api::order.order', orderId, {
    filters: {
      customer: { id: userId }
    },
    populate: [
      'order_invoice',
      'order_statuses',
      'receive_address',
      'receive_address.name',
      'receive_address.address',
      'receive_address.address.address_three_levels',
      'products',
      'products.inventory_item',
      'products.inventory_item.sku_quantity',
      'products.inventory_item.sku_quantity.sku',
      'products.inventory_item.sku_quantity.sku.product',
      'products.inventory_item.sku_quantity.sku.images',
      'products.inventory_item.sku_quantity.sku.pattern',
      'products.inventory_item.sku_quantity.sku.stretch',
      'products.inventory_item.sku_quantity.sku.width',
      'products.inventory_item.sku_quantity.sku.origin',
      'products.inventory_item.sku_quantity.sku.color',
      'delivery_method',
    ],
  })
  return processOrdersData([orderData])[0];
}

module.exports = () => ({
    async getOrders(userId) {
      const orders = await getOrdersOfUser(userId);
      return orders;
    },

    async getOrderById(userId, orderId) {
      const orders = await getOrderOfUserById(userId, orderId);
      return orders;
    },
});
