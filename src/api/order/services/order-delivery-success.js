'use strict';

module.exports = () => ({
  async deliverySuccess(id) {
    const statuses = await strapi.entityService.findMany('api::order-status.order-status', {
      filters: { order: id, status: 'success' },
    });
    if (statuses.length == 0) {
      await strapi.service('api::order.order-utils').createOrderStatus(id, 'success');
    }
  }
});