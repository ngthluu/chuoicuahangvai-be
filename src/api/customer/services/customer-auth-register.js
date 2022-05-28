'use strict';

const { env } = require('process');
const crypto = require('crypto');
const urlJoin = require('url-join');
const _ = require('lodash');
const utils = require('@strapi/utils');
const { yup, validateYupSchema, sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const registerBodySchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  phone: yup.string().required(),
});
const validateRegisterBody = validateYupSchema(registerBodySchema);

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const subjectTemplate = `Xác nhận đăng ký tài khoản mua vải lẻ`;
const messageTemplate = `<p>Cám ơn bạn đã đăng ký tài khoản trên hệ thống.</p>

<p>Để hoàn tất đăng ký, vui lòng bấm vào đường link dưới đây:</p>
<p><%= URL %>?code=<%= CODE %></p>

<p>Cám ơn rất nhiều.</p>`;

const sendConfirmationEmail = async (user) => {
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  // Sanitize the template's user information
  const sanitizedUserInfo = await sanitize.sanitizers.defaultSanitizeOutput(userSchema, user);

  const confirmationToken = crypto.randomBytes(20).toString('hex');

  await strapi.plugin('users-permissions').service('user').edit(user.id, { confirmationToken });

  const subject = _.template(subjectTemplate)({
    USER: sanitizedUserInfo
  });
  const message = _.template(messageTemplate)({
    URL: 'http://localhost/register-confirmation',
    USER: sanitizedUserInfo,
    CODE: confirmationToken,
  });

  // Send an email to the user.
  await strapi
    .plugin('email')
    .service('email')
    .send({
      to: user.email,
      from: `${env.SMTP_DEFAULT_NAME} <${env.SMTP_DEFAULT_FROM}>`,
      replyTo: user.email,
      subject: subject,
      text: message,
      html: message,
    });
}

module.exports = () => ({
  async register(ctx) {
    await validateRegisterBody(ctx.request.body);
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
    const params = {
      ..._.omit(ctx.request.body, ['confirmed', 'confirmationToken', 'resetPasswordToken']),
      provider: 'local',
    };

    if (strapi.plugin('users-permissions').service('user').isHashed(params.password)) {
      throw new ValidationError('Your password cannot contain more than three times the symbol `$`');
    }

    const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { name: 'Customer' } });
    if (!role) {
      throw new ApplicationError('Impossible to find role');
    }
    params.role = role.id;

    // Check if the provided email is valid or not.
    const isEmail = emailRegExp.test(params.email);
    if (isEmail) {
      params.email = params.email.toLowerCase();
    } else {
      throw new ValidationError('Please provide a valid email address');
    }

    const existed = await strapi.query('plugin::users-permissions.user').findOne({
      where: { email: params.email },
    });
    if (existed) {
      throw new ApplicationError('Email is already taken');
    }

    try {
      const user = await strapi.plugin('users-permissions').service('user').add(params);
      const sanitizedUser = await sanitizeUser(user, ctx);
      try {
        await sendConfirmationEmail(sanitizedUser);
      } catch (err) {
        throw new ApplicationError(err.message);
      }
      return ctx.send({ user: sanitizedUser });
    } catch (err) {
      if (_.includes(err.message, 'username')) {
        throw new ApplicationError('Username already taken');
      } else if (_.includes(err.message, 'email')) {
        throw new ApplicationError('Email already taken');
      } else {
        strapi.log.error(err);
        throw new ApplicationError('An error occurred during account creation');
      }
    }
  }
});
