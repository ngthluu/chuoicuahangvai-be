'use strict';

/**
 * refund router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::refund.refund', {
    config: {
        find: { middlewares: ['global::auth-branch-query'] },
        findOne: { middlewares: ['global::auth-branch-query'] },
    }
});
