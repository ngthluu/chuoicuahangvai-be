'use strict';

/**
 * voucher service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

const getYYYYMMDD = (date=null) => {
  if (date === null) return (new Date()).toISOString().split('T')[0];
  return (new Date(date)).toISOString().split('T')[0];
}

module.exports = createCoreService('api::voucher.voucher', ({ strapi }) => ({
  async getAvailableVouchers(customerId) {
    let availableVouchers = await strapi.entityService.findMany('api::voucher.voucher', {
      filters: { 
        available_start_date: { $lte: getYYYYMMDD() },
        available_end_date: { $gte: getYYYYMMDD() },
      },
      populate: ['voucher_uses', 'voucher_uses.customer']
    });
    const customer = await strapi.entityService.findOne('plugin::users-permissions.user', customerId);
    availableVouchers = availableVouchers.filter((voucher) => {
      switch (voucher.apply_for) {
        case 'all_customers_limit_quantity': 
          const limitQuantity = parseInt(voucher.apply_for_value.quantity);
          const usedQuantity = voucher.voucher_uses.length
          if (usedQuantity >= limitQuantity) return false;
          const customerNotUsed = voucher.voucher_uses.filter((item) => item.customer.id === customer.id).length == 0;
          return customerNotUsed;
        case 'new_customers': 
          const today = new Date();
          const previousMonthDay = new Date(today.setMonth(today.getMonth() - 1));
          return getYYYYMMDD(customer.createdAt) >= getYYYYMMDD(previousMonthDay) 
            && getYYYYMMDD(customer.createdAt) <= getYYYYMMDD(today);
        default: return false;
      }
    });

    return availableVouchers;
  },
  async getAvailableVoucherById(voucherId, customerId) {

  }
}));
