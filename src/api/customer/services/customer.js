'use strict';

/**
 * users service.
 */

module.exports = () => ({
    async fetchAll(params, populate) {
        return strapi.query('plugin::users-permissions.user').findMany({
            select: ['id', 'email', 'phone', 'blocked'],
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
            where: { id: id },
        });
    }
});
