'use strict';

const utils = require('@strapi/utils');
const { ValidationError } = utils.errors;

const { yup, validateYupSchema } = require('@strapi/utils');
const validateSchema = yup.object().shape({
  skus: yup.array().of(
    yup.object().shape({
      id: yup.number().required(),
      length: yup.number().required(),
    })
  ),
  note: yup.string(),
  isDebt: yup.boolean(),
  deliveryInfo: yup.object().required().shape({
    email: yup.string().email().required(),
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    address: yup.string().required(),
    wardId: yup.number().required(),
  }),
  deliveryMethod: yup.object().required().shape({
    id: yup.number().required(),
  }),
  paymentType: yup.string().required().oneOf(['cod', 'vnpay']),
});

module.exports = () => ({
  async process(user, data) {
    await validateYupSchema(validateSchema)(data);
    
    let { note, isDebt, deliveryInfo, deliveryMethod, paymentType } = data;
    const cartData = await strapi.service('api::cart.cart-step-cart').process(user, data);
    const realDeliveryMethod = deliveryMethods.filter((item) => item.id == deliveryMethod);
    if (realDeliveryMethod.length == 0) {
      throw new ValidationError('Invalid delivery method');
    }

    return 'ok';
  }
});
