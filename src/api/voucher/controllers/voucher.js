'use strict';

const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

/**
 *  voucher controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::voucher.voucher', ({strapi}) => ({
  async getAvailableVouchers(ctx) {
    const { user } = ctx.state;
    if (!user) {
      throw new ApplicationError('Cant list vouchers for an anonymous customer');
    }
    const data = await strapi.service('api::voucher.voucher').getAvailableVouchers(user.id);
    ctx.body = data;
  },
}));
