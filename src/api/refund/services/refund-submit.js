'use strict';

const refundSubmit = require("../routes/refund-submit");

/**
 * warehouse-import-submit service.
 */

async function getRefundFromId(id) {
    const refund = await strapi.entityService.findOne('api::refund.refund', id, {
        populate: ['customer', 'customer.name', 'branch', 'products', 'products.sku']
    });
    return refund;
}

async function createImportFromRefund(refund) {
    const importData = await strapi.entityService.create('api::warehouse-import.warehouse-import', {
        data: {
            refund: refund.id,
            branch: refund.branch.id,
            products: refund.products.map((item) => {
                return {
                    sku: item.sku.id,
                    length: item.length,
                    quantity: item.quantity,
                }
            }),
        }
    });
    return importData;
}

module.exports = () => ({
    async submitRefund(id, userId) {
        const refund = await getRefundFromId(id);
        
        const importData = await createImportFromRefund(refund);
        await strapi.service('api::warehouse-import.warehouse-import-submit').submitImport(importData.id, userId); 
        
        await strapi.service('api::refund.refund-utils').createRefundStatus(refund.id, userId, true);
        await strapi.service('api::refund.refund-utils').createInvoiceFromRefund(refund);
    }
});
