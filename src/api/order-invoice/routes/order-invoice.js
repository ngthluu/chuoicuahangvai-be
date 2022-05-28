'use strict';

/**
 * order-invoice router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::order-invoice.order-invoice', {
    config: {
        find: { middlewares: ['api::order-invoice.order-invoice-branch'] },
        findOne: { middlewares: ['api::order-invoice.order-invoice-branch'] },
    }
});
