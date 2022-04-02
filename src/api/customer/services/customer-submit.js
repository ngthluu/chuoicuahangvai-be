'use strict';

/**
 * warehouse-catalogue-submit service.
 */

const getCustomerData = async (id) => {
    const data = await strapi.query('plugin::users-permissions.user').findOne({
        where: {
            role: {
                name: 'Customer'
            },
            id: id,
        },
    });
    return data;
}

const updateStatus = async (id, status) => {
    strapi.entityService.update('plugin::users-permissions.user', id, {
        data: {
            blocked: !status,
        }
    });
}

module.exports = () => ({
    async changeStatus(id) {
        const customerData = await getCustomerData(id);
        updateStatus(id, customerData.blocked)
    }
});
