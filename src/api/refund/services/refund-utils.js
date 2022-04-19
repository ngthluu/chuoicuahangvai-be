'use strict';

/**
 * product-create service.
 */

module.exports = () => ({

    async createRefundStatus(refundId, userId, status) {
        await strapi.service('api::refund-status.refund-status').create({
            data: {
                refund: refundId,
                update_user: userId,
                update_status: status,
                update_time: (new Date()).toISOString(),
            }
        });
    },

    async createInvoiceFromRefund(refund) {
        let data = {
            refund: refund.id,
            customer_name: {
                firstname: refund.customer.name.firstname,
                lastname: refund.customer.name.lastname,
            },
            customer_phone: refund.customer.phone,
            products: refund.products.map((item) => ({
                sku: item.sku.id,
                length: item.length,
                quantity: item.quantity,
            })),
            price: refund.products.reduce(
                (prev, item) => prev + 0.01 * item.length * item.sku.price, 
            0),
        }

        const { id } = await strapi.service('api::refund-invoice.refund-invoice').create({
            data: data
        });
        return id;
    },

});
