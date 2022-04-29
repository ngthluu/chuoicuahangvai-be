'use strict';

/**
 * users service.
 */

const select = ['id', 'username', 'email', 'blocked', 'phone'];
const where = {
    role: {
        name: {
            $notIn: ['Super Admin', 'Customer', 'Public', 'Authenticated']
        }
    },
}

module.exports = () => ({
    async fetchAll(params, populate) {
        return strapi.query('plugin::users-permissions.user').findMany({
            select: select,
            where: { ...where, ...params },
            populate: populate,
        });
    },

    async fetchOne(id, params, populate) {
        return strapi.query('plugin::users-permissions.user').findOne({
            select: select,
            where: { ...where, id: id, ...params },
            populate: populate,
        });
    },
});
