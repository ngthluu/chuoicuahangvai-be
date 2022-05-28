'use strict';

/**
 * branch router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::branch.branch', {
    config: {
        find: { middlewares: ['global::auth-branch-id-query'] },
        findOne: { middlewares: ['global::auth-branch-id-query'] },
    }
});
