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
    async create(data) {
        await strapi.db.query('plugin::users-permissions.user').create({
            data: data,
        });
    },
});
