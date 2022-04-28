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
    id: yup.number().required(),
  }),
  paymentType: yup.string().required().oneOf(['cod', 'online']),
});

module.exports = () => ({
  async process(user, data) {
    await validateYupSchema(validateSchema)(data);
    
    let { note, isDebt, deliveryInfo, deliveryMethod, paymentType } = data;
    const { skus } = await strapi.service('api::cart.cart-step-cart').process(user, data);

    const deliveryMethods = await strapi.service('api::cart.cart-step-delivery').getDeliveryMethods(); 
    const realDeliveryMethod = deliveryMethods.filter((item) => item.id == deliveryMethod.id);
    if (realDeliveryMethod.length == 0) {
      throw new ValidationError('Invalid delivery method');
    }

    let orderData = {
        type: paymentType,
        receive_address: {
            name: {
                firstname: deliveryInfo.firstname,
                lastname: deliveryInfo.lastname,
            },
            address: {
                address: deliveryInfo.address,
                address_three_levels: deliveryInfo.wardId,
            },
            phone: deliveryInfo.phone,
        },
        note: note,
    }
    if (user) {
        orderData =  {...orderData, customer: user.id  };
    } else {
        const customerData = await strapi.service('api::customer.customer-create').createAnonymous({
            firstName: deliveryInfo.firstname,
            lastName: deliveryInfo.lastname,
            phone: deliveryInfo.phone,
        });
        orderData =  {...orderData, customer: customerData.id  };
    }

    return orderData;
  }
});
