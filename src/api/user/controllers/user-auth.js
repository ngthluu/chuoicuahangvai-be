'use strict';

const utils = require('@strapi/utils');
const { ValidationError, ApplicationError } = utils.errors;

const { yup, validateYupSchema } = require('@strapi/utils');

const callbackBodySchema = yup.object().shape({
  identifier: yup.string().required(),
  password: yup.string().required(),
});
const validateCallbackBody = validateYupSchema(callbackBodySchema);
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const { sanitize } = utils;
const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = {
  login: async (ctx) => {
    const provider = 'local';
    const params = ctx.request.body;

    await validateCallbackBody(params);

    const query = { provider };

    const isEmail = emailRegExp.test(params.identifier);
    if (isEmail) {
      query.email = params.identifier.toLowerCase();
    } else {
      query.username = params.identifier;
    }

    const user = await strapi.query('plugin::users-permissions.user').findOne({ 
      where: query,
      populate: ['role'],
    });
    if (!user) {
      throw new ValidationError('Invalid identifier');
    }

    if (user.blocked === true) {
      throw new ApplicationError('Your account has been blocked by an administrator');
    }

    if (!user.password) {
      throw new ApplicationError(
        'This user never set a local password, please login with the provider used during account creation'
      );
    }

    const validPassword = await strapi.plugin('users-permissions').service('user').validatePassword(
      params.password,
      user.password
    );

    if (!validPassword) {
      throw new ValidationError('Invalid password');
    } else {
      ctx.send({
        jwt: strapi.plugin('users-permissions').service('jwt').issue({
          id: user.id,
          role: {
            id: user.role.id,
            name: user.role.name,
          },
          permission_map: await strapi.service('api::permission.permission').getPermissionMap(user.role.name),
        }),
        user: await sanitizeUser(user, ctx),
      });
    }
  },
};
