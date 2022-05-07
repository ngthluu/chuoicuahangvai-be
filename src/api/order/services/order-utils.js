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
                'receive_address',
                'receive_address.name',
                'receive_address.address',
                'receive_address.address.address_three_levels',
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
        strapi.log.info(JSON.stringify(orderData.receive_address));
        if (orderData.receive_address) {
            data = {
                ...data,
                receive_address: {
                    name: {
                        firstname: orderData.receive_address.name.firstname,
                        lastname: orderData.receive_address.name.lastname,
                    },
                    address: {
                        address: orderData.receive_address.address.address,
                        address_three_levels: orderData.receive_address.address.address_three_levels.id,
                    },
                    phone: orderData.receive_address.phone,
                    is_default: orderData.receive_address.is_default,
                }
            }
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
