'use strict';

/**
 * warehouse-import service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::warehouse-import.warehouse-import');
