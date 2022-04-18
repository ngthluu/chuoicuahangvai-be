'use strict';

/**
 * refund-invoice service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::refund-invoice.refund-invoice');
