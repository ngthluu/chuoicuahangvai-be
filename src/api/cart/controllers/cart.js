'use strict';

module.exports = {
  stepCart: async (ctx, next) => {
    const { user } = ctx.state;
    const data = await strapi.service("api::cart.cart-step-cart").process(user, ctx.request.body);
    ctx.body = data;
  },
  stepInformation: async (ctx, next) => {
    const { user } = ctx.state;
    const data = await strapi.service("api::cart.cart-step-info").process(user, ctx.request.body);
    ctx.body = data;
  },
  stepDelivery: async (ctx, next) => {
    const { user } = ctx.state;
    const data = await strapi.service("api::cart.cart-step-delivery").process(user, ctx.request.body);
    ctx.body = data;
  },
  stepComplete: async (ctx, next) => {
    const { user } = ctx.state;
    const data = await strapi.service("api::cart.cart-step-complete").process(user, ctx.request.body);
    ctx.body = data;
  },
};
