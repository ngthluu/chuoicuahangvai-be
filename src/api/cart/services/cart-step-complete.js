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
  deliveryMethod: yup.number().required(),
});

module.exports = () => ({
  async process(user, data) {
    await validateYupSchema(validateSchema)(data);
    
    let { note, isDebt, deliveryInfo, deliveryMethod } = data;
    const cartData = await strapi.service('api::cart.cart-step-cart').process(user, data);

    const deliveryMethods = await strapi.service('api::cart.cart-step-delivery').getDeliveryMethods(); 
    const realDeliveryMethod = deliveryMethods.filter((item) => item.id == deliveryMethod);
    if (realDeliveryMethod.length == 0) {
      throw new ValidationError('Invalid delivery method');
    }

    let returnData = {
      ...cartData,
      note: note ? note : '',
      isDebt: isDebt ? isDebt : false,
      deliveryInfo: deliveryInfo,
      deliveryMethod: realDeliveryMethod[0],
    }

    return returnData;
  }
});