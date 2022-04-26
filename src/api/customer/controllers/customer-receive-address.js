'use strict';

/**
 * A set of functions called "actions" for `warehouse-catalogue-submit`
 */

const getUserData = async (ctx, filters=[]) => {
  const { user } = ctx.state;
  const userData = await strapi.service('api::customer.customer').fetchOne(user.id, filters, [
    'receive_address',
    'receive_address.name',
    'receive_address.address',
    'receive_address.address_three_levels'
  ]);
  return userData;
}

module.exports = {
  getReceiveAddressList: async (ctx, next) => {
    try {
      const userData = await getUserData(ctx);
      ctx.body = userData.receive_address;
    } catch (err) {
      ctx.body = err;
    }
  },
  getReceiveAddressById: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      const userData = await getUserData(ctx);
      const receiveAddress = userData.receive_address;
      ctx.body = receiveAddress.filter((item) => item.id == id);
    } catch (err) {
      ctx.body = err;
    }
  },
};
