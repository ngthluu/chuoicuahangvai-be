'use strict';

/**
 * A set of functions called "actions" for `three-levels`
 */

module.exports = {
  listAllCity: async (ctx, next) => {
    const cities = await strapi.service('api::address.three-levels').listAllCity();
    ctx.body = { data: cities };
  },
  listAllDistrictsOfCity: async (ctx, next) => {
    const { query } = ctx;
    const districts = await strapi.service('api::address.three-levels').listAllDistrictsOfCity(query.city);
    ctx.body = { data: districts };
  },
  listAllWardsOfDistrict: async (ctx, next) => {
    const { query } = ctx;
    const wards = await strapi.service('api::address.three-levels').listAllWardsOfDistrict(query.district, query.city);
    ctx.body = { data: wards };
  },
};
