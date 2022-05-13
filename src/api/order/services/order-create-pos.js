'use strict';

/**
 * product-create service.
 */

module.exports = () => ({
    async createPos(user, data) {

        // Create export
        const exportData = await strapi.service('api::warehouse-export.warehouse-export').create({ 
            data: data,
            populate: [
                'products',
                'products.inventory_item',
                'products.inventory_item.sku_quantity',
                'products.inventory_item.sku_quantity.sku',
            ],
        });
        
        // Submit export
        await strapi.service('api::warehouse-export.warehouse-export-submit').submitExport(exportData.id, user.id); 
        
        // Create anonymous customer if not exists
        if (data.customerId === '') {
            const customerData = await strapi.service('api::customer.customer-create').createAnonymous(data);
            data.customerId = customerData.id;
        } 

        // Create order
        const orderCost = exportData.products.reduce((sum, _) => {
            return sum + parseInt(_.unit_price) * parseInt(_.length) * 0.01;
        }, 0);
        const orderData = await strapi.service('api::order.order').create({
            data: {
                customer: data.customerId,
                ...data,
                export: exportData.id,
                type: 'pos',
                isDebt: data.paymentCost < orderCost,
            },
        });

        // Create order status
        await strapi.service('api::order.order-utils').createOrderStatus(orderData.id, 'success');

        // Create order invoice
        const invoiceId = await strapi.service('api::order.order-utils').createOrderInvoiceFromOrder(orderData.id);

        // Create order payment invoice
        await strapi.service('api::order.order-utils').createOrderPaymentInvoiceFromInvoice(invoiceId, data.paymentCost);
    }
});
