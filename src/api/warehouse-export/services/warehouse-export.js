'use strict';

/**
 * warehouse-export service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::warehouse-export.warehouse-export');
