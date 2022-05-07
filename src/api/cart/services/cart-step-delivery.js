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
  isDebt: yup.boolean().required(),
  deliveryInfo: yup.object().required().shape({
    email: yup.string().email().required(),
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    address: yup.string().required(),
    wardId: yup.number().required(),
    phone: yup.string().required(),
  }),
});

const deliveryMethods = [
  {
    id: 'free',
    name: 'Vận chuyển miễn phí',
    estimate_time: '5-10 ngày',
    cost: 0,
  }, 
  {
    id: 'fast',
    name: 'Vận chuyển nhanh',
    estimate_time: '1-2 ngày',
    cost: 40000,
  }
];

module.exports = () => ({
  async getDeliveryMethods() {
    return deliveryMethods;
  },

  async process(user, data) {
    await validateYupSchema(validateSchema)(data);
    
    let { note, isDebt, deliveryInfo } = data;
    if (isDebt && !user) {
      throw new ApplicationError('Cant checkout a debt order for anonymous user');
    }
    const cartData = await strapi.service('api::cart.cart-step-cart').process(user, data);

    let returnData = {
      ...cartData,
      note: note ? note : '',
      isDebt: isDebt ? isDebt : false,
      deliveryInfo: deliveryInfo,
      deliveryMethods: deliveryMethods,
    }

    return returnData;
  }
});
