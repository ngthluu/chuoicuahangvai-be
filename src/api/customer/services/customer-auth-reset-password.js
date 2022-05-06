'use strict';

const _ = require('lodash');
const utils = require('@strapi/utils');
const { ValidationError } = utils.errors;

const { sanitize } = utils;
const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = () => ({
  async resetPassword(ctx) {
    const params = _.assign({}, ctx.request.body, ctx.params);
    strapi.log.info(JSON.stringify(params));
    if (
      params.password &&
      params.passwordConfirmation &&
      params.password === params.passwordConfirmation &&
      params.code
    ) {
      const user = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { resetPasswordToken: `${params.code}` } });

      if (!user) {
        throw new ValidationError('Incorrect code provided');
      }

      await strapi.plugin('users-permissions').service('user').edit(user.id, { resetPasswordToken: null, password: params.password });
  
      ctx.send({
        jwt: strapi.plugin('users-permissions').service('jwt').issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } else if (
      params.password &&
      params.passwordConfirmation &&
      params.password !== params.passwordConfirmation
    ) {
      throw new ValidationError('Passwords do not match');
    } else {
      throw new ValidationError('Incorrect params provided');
    }
  }
});
