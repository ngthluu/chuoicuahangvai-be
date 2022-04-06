'use strict';

/**
 * users service.
 */

const select = ['id', 'username', 'email', 'blocked', 'phone', 'salary_per_shift'];
const where = {
    role: {
        name: {
            $notIn: ['Super Admin', 'Customer', 'Public', 'Authenticated']
        }
    },
}

module.exports = () => ({
    async update(id, data) {
        await strapi.entityService.update('plugin::users-permissions.user', id, {
            data: data
        });
    },
});
