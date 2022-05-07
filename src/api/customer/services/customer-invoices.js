'use strict';

const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

const processInvoiceData = (invoice) => {
  if (!invoice) {
    throw new ApplicationError('Invoice does not exist');
  }
  return {
    code: `S-INVOICE#${invoice.id}`,
    order_code: `ORDER#${invoice.order.id}`,
    paidAmount: invoice.order_payment_invoices.reduce((sum, _) => sum + _.amount, 0),
    ...invoice,
  }
}

const getInvoiceById = async (invoiceId) => {
  let invoiceData = await strapi.entityService.findOne('api::order-invoice.order-invoice', invoiceId, {
    populate: [
      'order',
      'customer_name',
      'products',
      'products.inventory_item',
      'products.inventory_item.sku_quantity',
      'products.inventory_item.sku_quantity.sku',
      'products.inventory_item.sku_quantity.sku.product',
      'products.inventory_item.sku_quantity.sku.images',
      'products.inventory_item.sku_quantity.sku.pattern',
      'products.inventory_item.sku_quantity.sku.stretch',
      'products.inventory_item.sku_quantity.sku.width',
      'products.inventory_item.sku_quantity.sku.origin',
      'products.inventory_item.sku_quantity.sku.color',
      'receive_address',
      'receive_address.name',
      'receive_address.address',
      'receive_address.address.address_three_levels',
      'order_payment_invoices',
    ],
  })
  return processInvoiceData(invoiceData);
}

module.exports = () => ({
    async getInvoiceById(invoiceId) {
      const invoice = await getInvoiceById(invoiceId);
      return invoice;
    },
});
