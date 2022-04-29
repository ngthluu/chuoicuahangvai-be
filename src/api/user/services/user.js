'use strict';

/**
 * users service.
 */

const forbiddenRoles = ['Super Admin', 'Customer', 'Public', 'Authenticated'];
const select = ['id', 'username', 'email', 'blocked', 'phone'];
const where = {
    role: {
        name: {
            $notIn: forbiddenRoles
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

    async getRoles() {
        const roles = await strapi.service('plugin::users-permissions.role').getRoles();
        return roles.filter((item) => !forbiddenRoles.includes(item.name));
    }
});
