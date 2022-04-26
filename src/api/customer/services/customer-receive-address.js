'use strict';

const getUserData = async (userId, filters=[]) => {
    const userData = await strapi.service('api::customer.customer').fetchOne(userId, filters, [
      'receive_address',
      'receive_address.name',
      'receive_address.address',
      'receive_address.address.address_three_levels'
    ]);
    return userData;
  }

module.exports = () => ({
    async getReceiveAddressList(userId) {
        const userData = await getUserData(userId);
        return userData.receive_address;
    },

    async getReceiveAddressById(userId, receiveAddressId) {
        const userData = await getUserData(userId);
        const receiveAddress = userData.receive_address;
        return receiveAddress.filter((item) => item.id == receiveAddressId);
    }
});
