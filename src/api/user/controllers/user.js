'use strict';

const { yup, validateYupSchema } = require('@strapi/utils');
const resetPasswordSchema = yup.object().shape({
  currentPassword: yup.string().required(),
  newPassword: yup.string().required(),
  rePassword: yup.string().oneOf([yup.ref('newPassword'), null], "Passwords don't match").required('Confirm Password is required'),
});

module.exports = {
  find: async (ctx, next) => {
    const data = await strapi.service('api::user.user').fetchAll(ctx.query.filters, ctx.query.populate);
    ctx.body = { data: data };
  },

  findOne: async (ctx, next) => {
    const { id } = ctx.params
    const data = await strapi.service('api::user.user').fetchOne(id, ctx.query.filters, ctx.query.populate);
    ctx.body = { data: data };
  },
  getRoles: async (ctx, next) => {
    const data = await strapi.service('api::user.user').getRoles();
    ctx.body = data;
  },
  resetPassword: async (ctx, next) => {
    await validateYupSchema(resetPasswordSchema)(ctx.request.body);
    
    const { user } = ctx.state;
    const { currentPassword, newPassword } = ctx.request.body;
    
    await strapi.service('api::user.user-password').resetPassword({user, currentPassword, newPassword});
    ctx.body = 'ok';
  },
  resetPasswordForUser: async (ctx, next) => {
    const { id } = ctx.params;
    await strapi.service('api::user.user-password').resetPasswordForUser(id);
    ctx.body = 'ok';
  },
};
