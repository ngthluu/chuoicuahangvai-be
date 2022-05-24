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
  voucher: yup.object().shape({
    code: yup.string().required(),
  }),
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
  deliveryMethod: yup.object().required().shape({
    id: yup.string().required().oneOf(['free', 'fast']),
  }),
});

const paymentMethods = [
  {
    type: 'cod',
    name: 'Thanh toán khi nhận hàng',
  }, 
  {
    type: 'online',
    name: 'Thanh toán trực tuyến - VNPAY',
  }
];

module.exports = () => ({
  async process(user, data) {
    await validateYupSchema(validateSchema)(data);
    
    let { note, isDebt, voucher, deliveryInfo, deliveryMethod } = data;
    if (isDebt && !user) {
      throw new ApplicationError('Cant checkout a debt order for anonymous user');
    }
    const cartData = await strapi.service('api::cart.cart-step-cart').process(user, data);

    const deliveryMethods = await strapi.service('api::cart.cart-step-delivery').getDeliveryMethods(); 
    const realDeliveryMethod = deliveryMethods.filter((item) => item.id == deliveryMethod.id);
    if (realDeliveryMethod.length == 0) {
      throw new ValidationError('Invalid delivery method');
    }

    let returnData = {
      ...cartData,
      note: note ? note : '',
      isDebt: isDebt ? isDebt : false,
      deliveryInfo: deliveryInfo,
      deliveryMethod: realDeliveryMethod[0],
      paymentMethods: paymentMethods,
    }

    if (user && voucher) {
      const voucherData = await strapi
        .service('api::voucher.voucher')
        .getAvailableVoucherByCode(voucher.code, user.id, cartData.price);
      if (voucherData) {
        returnData = { ...returnData, voucher: voucherData };
      }
    }

    return returnData;
  }
});
