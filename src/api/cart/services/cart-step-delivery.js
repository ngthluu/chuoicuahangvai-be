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
});

const deliveryMethods = [
  {
    id: 1,
    name: 'Vận chuyển miễn phí',
    estimate_time: '5-10 ngày',
    cost: 0,
  }, 
  {
    id: 2,
    name: 'Vận chuyển nhanh',
    estimate_time: '1-2 ngày',
    cost: 40000,
  }
];

module.exports = () => ({
  async process(user, data) {
    await validateYupSchema(validateSchema)(data);
    
    let { note, isDebt, deliveryInfo } = data;
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
