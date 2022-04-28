'use strict';

module.exports = {
  stepCart: async (ctx, next) => {
    const data = await strapi.service("api::cart.cart-step-cart").process(ctx.request.body);
    ctx.body = data;
  },
  stepInformation: async (ctx, next) => {
    const data = await strapi.service("api::cart.cart-step-info").process(ctx.request.body);
    ctx.body = data;
  },
  stepDelivery: async (ctx, next) => {
    const data = await strapi.service("api::cart.cart-step-delivery").process(ctx.request.body);
    ctx.body = data;
  },
  stepComplete: async (ctx, next) => {
    const data = await strapi.service("api::cart.cart-step-complete").process(ctx.request.body);
    ctx.body = data;
  },
};
