'use strict';

const utils = require('@strapi/utils');
const { ApplicationError, ValidationError } = utils.errors;

const { yup, validateYupSchema } = require('@strapi/utils');
const validateSchema = yup.object().shape({
  skus: yup.array().required().of(
    yup.object().shape({
      id: yup.number().required(),
      length: yup.number().required(),
    })
  ),
  note: yup.string(),
  isDebt: yup.boolean(),
});

module.exports = () => ({
  async process(user, data) {
    await validateYupSchema(validateSchema)(data);
    
    let { note, isDebt } = data;
    if (isDebt && !user) {
      throw new ApplicationError('Cant checkout a debt order for anonymous user');
    }
    const cartData = await strapi.service('api::cart.cart-step-cart').process(user, data);

    let returnData = {
      ...cartData,
      note: note ? note : '',
      isDebt: isDebt ? isDebt : false,
    }

    if (user) {
      const receiveAddress = await strapi.service('api::customer.customer-receive-address').getReceiveAddressList(user.id);
      returnData = {
        ...returnData,
        receiveAddress: {
          ...receiveAddress,
          email: user.email
        }
      }
    }

    return returnData;
  }
});
