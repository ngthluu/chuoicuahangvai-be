'use strict';

/**
 * users service.
 */

module.exports = () => ({
    async fetchAll(params, populate) {
        return strapi.query('plugin::users-permissions.user').findMany({
            select: ['id', 'username', 'email', 'blocked'],
            where: {
                role: {
                    name: {
                        $notIn: ['Super Admin']
                    }
                },
                ...params
            },
            populate: populate,
        });
    },
});
