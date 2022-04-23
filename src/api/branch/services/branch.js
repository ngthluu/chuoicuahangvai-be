'use strict';

/**
 * branch service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::branch.branch', ({strapi}) => ({
    async find(args) {
        const { user, ...otherArgs } = args
        const fetchUser = await strapi.service('api::user.user').fetchOne(user.id, [], ['branches'])
        let fetchArgs = {...otherArgs}
        if (fetchUser) {
            fetchArgs = {
                ...fetchArgs,
                filters: { 
                    id: { 
                        $in: fetchUser.branches.map((item) => item.id) 
                    } 
                }
            }
        }
        strapi.log.info(JSON.stringify(fetchArgs));
        const { results, pagination } = await super.find(fetchArgs);
        return { results, pagination }
    }
}));
