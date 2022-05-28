'use strict';

module.exports = () => ({
    async updateDebt(id, data, user) {
        let customerOrders = await strapi.entityService.findMany('api::order.order', {
            filters: { customer: { id: { $eq: id } } },
            populate: ['order_invoice', 'order_invoice.order_payment_invoices']
        });
        customerOrders = customerOrders
        .filter((order) => order.order_invoice != null)
        .map((order) => {
            const orderInvoice = order.order_invoice;
            const total = orderInvoice.price;
            const paid = orderInvoice.order_payment_invoices.reduce((_, invoice) => _ + parseInt(invoice.amount), 0);
            const debt = total - paid;
            return {
                invoiceId: orderInvoice.id,
                debt: debt,
            }
        });
        let debtPayAmount = parseInt(data.amount);
        for (let order of customerOrders) {
            order.paid = (order.debt - debtPayAmount) >= 0 ? debtPayAmount : order.debt;
            debtPayAmount -= order.debt;
            if (debtPayAmount <= 0) break;
        }
        for (let order of customerOrders) {
            if (!order.hasOwnProperty('paid')) continue;
            await strapi.service('api::order.order-utils').createOrderPaymentInvoiceFromInvoice(
                order.invoiceId,
                order.paid,
                user.id
            );
        }
    }
});
