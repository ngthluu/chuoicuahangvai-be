'use strict';

/**
 * product-create service.
 */

module.exports = () => ({

    async createOrderStatus(orderId, status) {
        await strapi.service('api::order-status.order-status').create({
            data: {
                order: orderId,
                status: status,
            }
        });
    },

    async createOrderInvoiceFromOrder(orderId) {
        let orderData = await strapi.service('api::order.order').findOne(orderId, {
            populate: [
                'customer',
                'customer.name',
                'products',
                'products.inventory_item',
                'products.inventory_item.sku_quantity',
                'products.inventory_item.sku_quantity.sku',
            ]
        });

        let data = {
            order: orderId,
            customer_name: {
                firstname: orderData.customer.name.firstname,
                lastname: orderData.customer.name.lastname,
            },
            customer_phone: orderData.customer.phone,
            products: orderData.products.map((item) => ({ 
                inventory_item: item.inventory_item.id,
                length: item.length,
            })),
            price: orderData.products.reduce(
                (prev, item) => prev + 0.01 * item.length * item.inventory_item.sku_quantity.sku.price, 
            0),
        }

        const { id } = await strapi.service('api::order-invoice.order-invoice').create({
            data: data
        });
        return id;
    },

    async createOrderPaymentInvoiceFromInvoice(invoiceId, amount) {
        await strapi.service('api::order-payment-invoice.order-payment-invoice').create({
            data: {
                order_invoice: invoiceId,
                amount: amount,
            }
        });
    }
});
