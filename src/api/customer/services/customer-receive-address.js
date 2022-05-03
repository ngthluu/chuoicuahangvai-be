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
    },

    async addReceiveAddress(userId, data) {
      const {firstname, lastname, phone, address, ward_id, is_default} = data;
      const userData = await getUserData(userId);
      let receiveAddress = userData.receive_address;
      if (is_default) {
        for (let i = 0; i < receiveAddress.length; ++i) {
          receiveAddress[i].is_default = false;
        }
      }
      await strapi.entityService.update('plugin::users-permissions.user', userData.id, {
        data: {
          receive_address: [
            ...receiveAddress,
            {
              name: {
                firstname: firstname,
                lastname: lastname,
              },
              address: {
                address: address,
                address_three_levels: ward_id,
              },
              phone: phone,
              is_default: is_default,
            },
          ],
        },
      });
      return true;
    },

    async updateReceiveAddress(id, userId, data) {
      const {firstname, lastname, phone, address, ward_id, is_default} = data;
      const userData = await getUserData(userId);
      const receiveAddressData = userData.receive_address.map((item) => {
        if (item.id == id) {
          return {
            name: {
              firstname: firstname,
              lastname: lastname,
            },
            address: {
              address: address,
              address_three_levels: ward_id,
            },
            phone: phone,
            is_default: is_default,
          };
        } else {
          if (is_default) {
            item.is_default = false;
          }
          return item;
        }
      });
      await strapi.entityService.update('plugin::users-permissions.user', userData.id, {
        data: {
          receive_address: receiveAddressData,
        },
      });
      return true;
    },

    async deleteReceiveAddress(id, userId) {
      const userData = await getUserData(userId);
      const receiveAddressData = userData.receive_address.filter((item) => item.id != id);
      await strapi.entityService.update('plugin::users-permissions.user', userData.id, {
        data: {
          receive_address: receiveAddressData,
        },
      });
      return true;
    },
});
