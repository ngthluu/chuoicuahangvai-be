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
});
