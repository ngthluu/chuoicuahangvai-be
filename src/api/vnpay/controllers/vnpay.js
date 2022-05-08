'use strict';

const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

module.exports = {
  handleReturnUrl: async (ctx, next) => {
    const isValid = await strapi.service('api::vnpay.vnpay').processReturnUrl(ctx.query);
    if (!isValid) {
      throw new ApplicationError('Invalid request');
    } else {
      ctx.body = 'ok';
    }
  },
  handleIPNUrl: async (ctx, next) => {
    const RspCode = await strapi.service('api::vnpay.vnpay').processIPNUrl(ctx.query);
    const Message = await strapi.service('api::vnpay.vnpay').getMessageFromRspCode(RspCode);
    ctx.send({ RspCode, Message });
  },
};
