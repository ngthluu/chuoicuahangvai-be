'use strict';

/**
 *  branch controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::branch.branch', ({strap}) => ({
    async find(ctx) {
        ctx.query = {
            ...ctx.query,
            user: ctx.state.user
        }
        const { data, meta } = await super.find(ctx)
        return { data, meta };
    }
}));
