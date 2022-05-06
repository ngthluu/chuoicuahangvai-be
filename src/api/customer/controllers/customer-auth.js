'use strict';

const utils = require('@strapi/utils');
const { ValidationError } = utils.errors;

module.exports = {
  register: async (ctx, next) => {
    await strapi.service('api::customer.customer-auth-register').register(ctx);
  },

  login: async (ctx, next) => {
    await strapi.controller('plugin::users-permissions.auth').callback(ctx);
    const { id } = ctx.response.body.user;
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', id, {
      populate: ['role'],
    });
    if (user.role.name !== 'Customer') {
      throw new ValidationError('Invalid identifier or password');
    }
  },

  forgotPassword: async (ctx, next) => {
    await strapi.service('api::customer.customer-auth-forgot-password').forgotPassword(ctx);
  },

  resetPassword: async (ctx, next) => {
    await strapi.service('api::customer.customer-auth-reset-password').resetPassword(ctx);
  },

  registerConfirm: async (ctx, next) => {
    await strapi.service('api::customer.customer-auth-register-confirm').confirm(ctx);
  }
};
