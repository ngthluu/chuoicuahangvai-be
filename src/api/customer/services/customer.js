'use strict';

/**
 * users service.
 */

module.exports = () => ({
    async fetchAll(params, populate) {
        return strapi.query('plugin::users-permissions.user').findMany({
            orderBy: { createdAt: 'DESC' },
            select: ['id', 'email', 'phone', 'blocked', 'createdAt'],
            where: {
                role: {
                    name: 'Customer'
                },
                ...params
            },
            populate: populate,
        });
    },

    async fetchOne(id, params, populate) {
        return strapi.query('plugin::users-permissions.user').findOne({
            orderBy: { createdAt: 'DESC' },
            select: ['id', 'email', 'phone', 'blocked'],
            where: {
                role: {
                    name: 'Customer'
                },
                id: id,
                ...params
            },
            populate: populate,
        });
    },

    async deleteOne(id) {
        strapi.query('plugin::users-permissions.user').delete({
            where: {
                role: {
                    name: 'Customer'
                },
                id: id,
            },
        });
    }
});
