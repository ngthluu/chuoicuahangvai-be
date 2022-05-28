'use strict';

/**
 * warehouse-catalogue router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::warehouse-catalogue.warehouse-catalogue', {
    config: {
        find: { middlewares: ['global::auth-branch-query'] },
        findOne: { middlewares: ['global::auth-branch-query'] },
    }
});
