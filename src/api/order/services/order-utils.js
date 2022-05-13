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
                'delivery_method',
                'export',
                'order_payment_vnpay',
            ]
        });

        let data = {
            order: orderId,
            customer_name: {
                firstname: orderData.customer.name ? orderData.customer.name.firstname : '',
                lastname: orderData.customer.name ? orderData.customer.name.lastname : '',
            },
            customer_phone: orderData.customer.phone,
            products: orderData.products.map((item) => ({ 
                inventory_item: item.inventory_item.id,
                length: item.length,
                unit_price: item.unit_price,
            })),
            price: orderData.products.reduce(
                (prev, item) => prev + 0.01 * item.length * item.unit_price, 
                orderData.delivery_method ? parseInt(orderData.delivery_method.amount) : 0),
            delivery_method: {}
        }
        if (orderData.delivery_method) {
            data = {
                ...data, 
                delivery_method: {
                    amount: orderData.delivery_method.amount,
                    method: orderData.delivery_method.method,
                },
            }
        }
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
        if (orderData.export) {
            const exportData = await strapi
                .entityService
                .findOne('api::warehouse-export.warehouse-export', orderData.export.id, {
                populate: ['branch', 'products', 'products.inventory_item', 'order'],
            });
            data.products = exportData.products.map((_) => ({
                inventory_item: _.inventory_item.id,
                unit_price: _.unit_price,
                length: _.length,
            }));
        }

        const { id } = await strapi.service('api::order-invoice.order-invoice').create({
            data: data
        });

        // For online order only
        if (orderData.order_payment_vnpay) {
            await strapi.service('api::order.order-utils').createOrderPaymentInvoiceFromInvoice(id, orderData.order_payment_vnpay.amount);
        }

        return id;
    },

    async createOrderPaymentInvoiceFromInvoice(invoiceId, amount) {
        await strapi.service('api::order-payment-invoice.order-payment-invoice').create({
            data: {
                order_invoice: invoiceId,
                amount: amount,
            }
        });
    },

    async updateProducts(orderId, products) {
        const data = {
            products: products.map((item) => ({
                inventory_item: item.inventory_item.id,
                length: item.length,
            })),
        }
        await strapi.entityService.update('api::order.order', orderId, { data: data });
    }
});
