'use strict';

/**
 * order router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::order.order', {
    config: {
        find: { middlewares: ['global::auth-branch-query'] },
        findOne: { middlewares: ['global::auth-branch-query'] },
    }
});
