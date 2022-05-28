'use strict';

const _ = require('lodash');
const crypto = require('crypto');
const utils = require('@strapi/utils');
const { env } = require('process');
const { ApplicationError, ValidationError } = utils.errors;

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const subjectTemplate = `Khôi phục mật khẩu cho tài khoản mua vải lẻ`;
const messageTemplate = `<p>Chúng tôi nghe bảo bạn mới mất mật khẩu đúng không ?</p>

<p>Đừng lo ! Hãy bấm vào đây để lấy lại mật khẩu:</p>
<p><%= URL %>?code=<%= TOKEN %></p>

<p>Cám ơn rất nhiều.</p>`;

module.exports = () => ({
  async forgotPassword(ctx) {
    let { email } = ctx.request.body;
    const isEmail = emailRegExp.test(email);

    if (isEmail) {
      email = email.toLowerCase();
    } else {
      throw new ValidationError('Please provide a valid email address');
    }

    const user = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ 
        where: { email: email.toLowerCase() },
        populate: ['role'],
      });

    if (!user && user.role.name !== 'Customer') {
      throw new ApplicationError('This email does not exist');
    }

    if (user.blocked) {
      throw new ApplicationError('This user is disabled');
    }

    // Generate random token.
    const resetPasswordToken = crypto.randomBytes(64).toString('hex');

    const subject = _.template(subjectTemplate)({});
    const message = _.template(messageTemplate)({
      URL: 'http://localhost/reset-password',
      TOKEN: resetPasswordToken,
    });

    try {
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
    } catch (err) {
      throw new ApplicationError(err.message);
    }

    await strapi
      .query('plugin::users-permissions.user')
      .update({ where: { id: user.id }, data: { resetPasswordToken } });

    ctx.send({ ok: true });
  }
});
