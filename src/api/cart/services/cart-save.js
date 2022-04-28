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

const groupBy = (x,f)=>x.reduce((a,b)=>((a[f(b)]||=[]).push(b),a),{});

module.exports = () => ({

  async getSuitableInventoryItems(skus) {
    const cartItemIds = skus.map((item) => item.id);
    const inventories = await strapi.entityService.findMany('api::warehouse-inventory.warehouse-inventory', {
      sort: ['createdAt:asc'],
      filters: { 
        sku_quantity: {
          sku: {
            id: { $in: cartItemIds },
          },
        }, 
      },
      populate: [
        'sku_quantity',
        'sku_quantity.sku',
        'branch',
      ],
    });
    const chooseItems = skus
    .map((item) => {
      const inventoriesWithSku = inventories.filter((item2) => {
        return item2.sku_quantity.sku.id == item.id;
      });
      let data = [];
      for (const inventoryWithSkuItem of inventoriesWithSku) {
        const inventoryWithSkuItemLength = inventoryWithSkuItem.sku_quantity.length;
        item.length -= inventoryWithSkuItemLength;
        if (item.length < 0) {
          data.push({...inventoryWithSkuItem, length: item.length + inventoryWithSkuItemLength});
          break;
        } else {
          data.push({...inventoryWithSkuItem, length: inventoryWithSkuItemLength});
        }
      }
      return data;
    })
    .flat();

    return Object
    .entries(groupBy(chooseItems, (item) => item.branch.id))
    .map(([branchId, inventoryItems]) => {
      return {
        branch: branchId,
        products: inventoryItems.map((item) => {
          return {
            inventory_item: item.id,
            length: item.length,
          }
        }),
      }
    });
  },

  async process(user, data) {
    await validateYupSchema(validateSchema)(data);
    
    let { note, isDebt, deliveryInfo, deliveryMethod, paymentType } = data;
    const { skus, price } = await strapi.service('api::cart.cart-step-cart').process(user, data);

    const deliveryMethods = await strapi.service('api::cart.cart-step-delivery').getDeliveryMethods(); 
    const realDeliveryMethod = deliveryMethods.filter((item) => item.id == deliveryMethod.id);
    if (realDeliveryMethod.length == 0) {
      throw new ValidationError('Invalid delivery method');
    }
    const totalPrice = price + realDeliveryMethod[0].cost;

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
        orderData =  { ...orderData, customer: user.id  };
    } else {
        const customerData = await strapi
        .service('api::customer.customer-create')
        .createAnonymous({
            firstName: deliveryInfo.firstname,
            lastName: deliveryInfo.lastname,
            phone: deliveryInfo.phone,
        });
        orderData =  {...orderData, customer: customerData.id  };
    }

    const items = await this.getSuitableInventoryItems(skus);
    let orderIds = [];
    for (const item of items) {
      const order = await strapi.service('api::order.order').create({
        data: {
          ...orderData,
          ...item,
        }
      });
      orderIds.push(order.id);
      await strapi.service('api::order.order-utils').createOrderStatus(order.id, 'initialize');
    }
    // Online payment here
    if (!isDebt && paymentType === 'online') {
      const url = await strapi.service('api::cart.cart-vnpay').createPaymentUrl({
        orders: orderIds,
        totalAmount: totalPrice,
      });
      return { status: 'ok', url: url };
    }
    return { status: 'ok' };
  }
});
