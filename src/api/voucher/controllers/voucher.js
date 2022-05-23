'use strict';

const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

const { yup, validateYupSchema } = utils;
const validateSchema = yup.object().shape({
  orderAmount: yup.number().required().positive(),
});

/**
 *  voucher controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::voucher.voucher', ({strapi}) => ({
  async getAvailableVouchers(ctx) {

    await validateYupSchema(validateSchema)(ctx.request.body);

    const { user } = ctx.state;
    if (!user) {
      throw new ApplicationError('Cant list vouchers for an anonymous customer');
    }
  
    const { orderAmount } = ctx.request.body;
    const data = await strapi.service('api::voucher.voucher').getAvailableVouchers(user.id, orderAmount);
    ctx.body = data;
  },
}));
