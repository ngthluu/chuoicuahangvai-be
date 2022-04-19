'use strict';

/**
 * product-create service.
 */

module.exports = () => ({
    async createRefund(user, data) {

        // Create anonymous customer if not exists
        if (data.customerId === '') {
            const customerData = await strapi.service('api::customer.customer-create').createAnonymous(data);
            data.customerId = customerData.id;
        } 

        // Create order
        const orderData = await strapi.service('api::refund.refund').create({
            data: {
                customer: data.customerId,
                ...data,
            }
        });

        // Create order status
        await strapi.service('api::refund.refund-utils').createRefundStatus(orderData.id, user.id, false);
    }
});
