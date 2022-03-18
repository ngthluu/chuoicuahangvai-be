'use strict';

/**
 * users service.
 */

module.exports = () => ({
    async fetchAll(params, populate) {
        return strapi.query('plugin::users-permissions.user').findMany({
            select: ['id', 'phone', 'blocked'],
            where: {
                role: {
                    name: 'Customer'
                },
                ...params
            },
            populate: populate,
        });
    },
});
