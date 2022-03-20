'use strict';

/**
 * warehouse-catalogue service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::warehouse-catalogue.warehouse-catalogue');
