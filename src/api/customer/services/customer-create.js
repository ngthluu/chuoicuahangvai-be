'use strict';

module.exports = () => ({
    async createAnonymous(data) {
        const existedData = await strapi.entityService.findMany('plugin::users-permissions.user', {
            filters: {
                phone: data.phone,
                role: { name: 'Customer' },
            },
        });
        if (existedData.length > 0) {
            return { id: existedData[0].id };
        }

        const roles = await strapi.service('plugin::users-permissions.role').getRoles();
        const customerRole = roles.filter(item => item.name == 'Customer')[0];

        const createData = {
            username: `anonymous-${data.phone}`,
            email: `anonymous-${data.phone}@chv.com`,
            blocked: true,
            role: { id: customerRole.id },
            phone: data.phone,
            name: {
                firstname: data.firstName,
                lastname: data.lastName,
            },
        }
        
        const customerData = await strapi.entityService.create('plugin::users-permissions.user', { data: createData });
        return customerData;
    }
});
