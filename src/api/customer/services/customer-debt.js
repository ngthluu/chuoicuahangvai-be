'use strict';

module.exports = () => ({
    async updateDebt(id, data) {
        strapi.log.info(JSON.stringify([id, data]));
        let customerOrders = await strapi.entityService.findMany('api::order.order', {
            filters: { customer: { id: { $eq: id } } },
            populate: ['order_invoice', 'order_invoice.order_payment_invoices']
        });
        strapi.log.info(JSON.stringify(customerOrders));
        customerOrders = customerOrders.map((order) => {
            const orderInvoice = order.order_invoice;
            const total = orderInvoice.price;
            const paid = orderInvoice.order_payment_invoices.reduce((_, invoice) => _ + parseInt(invoice.amount), 0);
            const debt = total - paid;
            return {
                invoiceId: orderInvoice.id,
                debt: debt,
            }
        });
        strapi.log.info(JSON.stringify(customerOrders));
        let debtPayAmount = parseInt(data.amount);
        for (let order of customerOrders) {
            order.paid = (order.debt - debtPayAmount) >= 0 ? debtPayAmount : order.debt;
            debtPayAmount -= order.debt;
            if (debtPayAmount <= 0) break;
        }
        strapi.log.info(JSON.stringify(customerOrders));
        for (let order of customerOrders) {
            if (!order.hasOwnProperty('paid')) continue;
            await strapi.entityService.create('api::order-payment-invoice.order-payment-invoice', {
                data: {
                    order_invoice: order.invoiceId,
                    amount: order.paid,
                },
            });
        }
    }
});
