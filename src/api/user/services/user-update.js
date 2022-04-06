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
        await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: id },
            data: data,
        });
        strapi.log.info(JSON.stringify(data));
    },
});
