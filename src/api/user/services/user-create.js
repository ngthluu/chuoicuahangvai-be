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
    async create(data) {
        await strapi.entityService.create('plugin::users-permissions.user', {
            data: { ...data, provider: 'local', password: '123456' }
        });
    },
});
