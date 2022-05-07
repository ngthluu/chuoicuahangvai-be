'use strict';

module.exports = {
  deliverySuccess: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      await strapi.service('api::order.order-delivery-success').deliverySuccess(id); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
