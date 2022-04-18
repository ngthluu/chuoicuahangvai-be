'use strict';

/**
 * refund service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::refund.refund');
