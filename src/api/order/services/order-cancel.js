'use strict';

module.exports = () => ({
  async cancel(id, userId) {
    const statuses = await strapi.entityService.findMany('api::order-status.order-status', {
      filters: { order: id, status: 'canceled' },
    });
    if (statuses.length == 0) {
      await strapi.service('api::order.order-utils').createOrderStatus(id, 'canceled', userId);
    }
  }
});