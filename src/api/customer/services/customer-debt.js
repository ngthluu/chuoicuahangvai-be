'use strict';

module.exports = () => ({
    async updateDebt(id, data) {
        let amount = parseInt(data.amount);
        const customer = await strapi.entityService.findOne('plugin::users-permissions.user', id, {
            populate: ['orders', 'orders.order_invoice', 'orders.order_invoice.order_payment_invoices']
        });
        const orders = customer.orders.map(order => {
            const amount = order.order_invoice.price
            const paid = order.order_invoice.order_payment_invoices.reduce((prev, cur) => prev + parseInt(cur.amount), 0)
            const debt = amount - paid
            return {
                invoice_id: order.order_invoice.id,
                amount: amount,
                paid: paid,
                debt: debt,
            }
        }).sort((a, b) => b.debt - a.debt);
        for (let order of orders) {
            order.new_paid = (order.debt - amount) >= 0 ? amount : order.debt;
            amount -= order.debt;
            if (amount <= 0) break;
        }
        for (let order of orders) {
            if (!order.hasOwnProperty('new_paid')) continue;
            await strapi.entityService.create('api::order-payment-invoice.order-payment-invoice', {
                data: {
                    order_invoice: order.invoice_id,
                    amount: order.new_paid,
                },
            });
        }
    }
});
