'use strict';

/**
 * voucher service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

const getYYYYMMDD = (date=null) => {
  if (date === null) return (new Date()).toISOString().split('T')[0];
  return (new Date(date)).toISOString().split('T')[0];
}

const isValidVoucher = (voucher, customer) => {
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
}

const getVoucherInfo = (voucher, orderAmount) => {
  if (voucher.type === 'percent') {
    const percent = parseInt(voucher.type_value.percent);
    return {
      id: voucher.id,
      code: voucher.code,
      description: `Giảm giá ${percent}% đơn hàng`,
      amount: orderAmount * percent * 0.01,
    }
  } else if (voucher.type === 'percent_limit') {
    const percent = parseInt(voucher.type_value.percent);
    const limit = parseInt(voucher.type_value.limit);
    return {
      id: voucher.id,
      code: voucher.code,
      description: `Giảm giá ${percent}% đơn hàng, không vượt quá ${limit.toLocaleString()} VND`,
      amount: orderAmount * parseInt(percent) * 0.01 <= limit ? orderAmount * parseInt(percent) * 0.01 : limit,
    }
  } else if (voucher.type === 'amount') {
    const amount = parseInt(voucher.type_value.value);
    return {
      id: voucher.id,
      code: voucher.code,
      description: `Giảm giá ${amount.toLocaleString()} VND`,
      amount: orderAmount <= amount ? orderAmount : amount,
    }
  }
  return null;
}

module.exports = createCoreService('api::voucher.voucher', ({ strapi }) => ({
  async getAvailableVouchers(customerId, orderAmount) {
    let availableVouchers = await strapi.entityService.findMany('api::voucher.voucher', {
      filters: { 
        available_start_date: { $lte: getYYYYMMDD() },
        available_end_date: { $gte: getYYYYMMDD() },
      },
      populate: ['voucher_uses', 'voucher_uses.customer']
    });
    const customer = await strapi.entityService.findOne('plugin::users-permissions.user', customerId);
    
    availableVouchers = availableVouchers.filter((voucher) => isValidVoucher(voucher, customer));
    return availableVouchers.map((voucher) => getVoucherInfo(voucher, orderAmount));
  },
  async getAvailableVoucherByCode(voucherCode, customerId, orderAmount) {
    const vouchers = await strapi.entityService.findMany('api::voucher.voucher', {
      filters: { 
        code: { $eq: voucherCode },
        available_start_date: { $lte: getYYYYMMDD() },
        available_end_date: { $gte: getYYYYMMDD() },
      },
      populate: ['voucher_uses', 'voucher_uses.customer']
    });
    if (vouchers.length == 0) return null;
    const voucher = vouchers[0];
    const customer = await strapi.entityService.findOne('plugin::users-permissions.user', customerId);
    
    if (!isValidVoucher(voucher, customer)) return null;
    return getVoucherInfo(voucher, orderAmount);
  }
}));
