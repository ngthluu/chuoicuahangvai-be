'use strict';

/**
 * A set of functions called "actions" for `warehouse-catalogue-submit`
 */

const utils = require('@strapi/utils');
const { sanitize } = utils;
const { ValidationError } = utils.errors;

const getCustomerRoleId = async () => {
  const roles = await strapi.service('plugin::users-permissions.role').getRoles();
  const customerRole = roles.filter(item => item.name == 'Customer')[0];
  return customerRole.id;
}

module.exports = {
  register: async (ctx, next) => {
    try {
      const { email, firstname, lastname, password, phone } = ctx.request.body;
      ctx.request.body = {
        username: email,
        email: email,
        password: password,
        phone: phone,
        name: {
          firstname: firstname,
          lastname: lastname,
        },
      }
      await strapi.controller('plugin::users-permissions.auth').register(ctx);
      const { id } = ctx.response.body.user;
      await strapi.entityService.update('plugin::users-permissions.user', id, {
        data: { role: await getCustomerRoleId() }
      });
    } catch (err) {
      ctx.body = err;
    }
  },
  login: async (ctx, next) => {
    try {
      ctx.request.body = {
        role: await getCustomerRoleId(),
        ...ctx.request.body,
      }
      await strapi.controller('plugin::users-permissions.auth').callback(ctx);
      
      const { id } = ctx.response.body.user;
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', id, {
        populate: ['role'],
      });
      if (user.role.name !== 'Customer') {
        throw new ValidationError('Invalid identifier or password');
      }
    } catch (err) {
      ctx.body = err;
    }
  }
};