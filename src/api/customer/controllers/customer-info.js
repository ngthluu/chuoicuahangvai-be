'use strict';

const utils = require('@strapi/utils');
const { yup, validateYupSchema } = utils;
const { ApplicationError } = utils.errors;
const validateInfoSchema = yup.object().shape({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  phone: yup.string().required(),
});

module.exports = {
  getInfo: async (ctx, next) => {
    const { user } = ctx.state;
    const customer = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ 
        where: { id: user.id },
        populate: ['name'],
      });
    ctx.body = {
      email: customer.email,
      firstname: customer.name.firstname,
      lastname: customer.name.lastname,
      phone: customer.phone,
    }
  },

  updateInfo: async (ctx, next) => {
    await validateYupSchema(validateInfoSchema)(ctx.request.body);

    const { user } = ctx.state;
    if (!user) {
      throw new ApplicationError('Permission denied');
    }
    const { firstname, lastname, phone } = ctx.request.body;

    const data = {
      phone: phone,
      name: {
        firstname: firstname,
        lastname: lastname,
      },
    }

    await strapi
      .plugin('users-permissions')
      .service('user')
      .edit(user.id, data);
    
    ctx.body = 'ok';
  },
};
