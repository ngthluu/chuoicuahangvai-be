'use strict';

/**
 * user-leave router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::user-leave.user-leave', {
    config: {
        find: { middlewares: ['api::user-leave.user-leave-branch'] },
        findOne: { middlewares: ['api::user-leave.user-leave-branch'] },
    }
});
