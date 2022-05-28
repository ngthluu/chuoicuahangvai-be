'use strict';

/**
 * warehouse-export router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::warehouse-export.warehouse-export', {
    config: {
        find: { middlewares: ['global::auth-branch-query'] },
        findOne: { middlewares: ['global::auth-branch-query'] },
        create: { middlewares: ['global::auth-branch-body'] },
        update: { middlewares: ['global::auth-branch-body'] },
    }
});
