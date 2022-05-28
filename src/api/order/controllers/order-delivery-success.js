'use strict';

module.exports = {
  deliverySuccess: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      await strapi.service('api::order.order-delivery-success').deliverySuccess(id, user.id); 
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
