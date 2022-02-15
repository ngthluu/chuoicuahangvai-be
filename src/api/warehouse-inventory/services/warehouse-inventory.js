'use strict';

/**
 * warehouse-inventory service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::warehouse-inventory.warehouse-inventory');
