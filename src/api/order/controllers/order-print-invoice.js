'use strict';

module.exports = {
  print: async (ctx, next) => {
    const { id } = ctx.params;
    const invoice = await strapi.entityService.findOne('api::order-invoice.order-invoice', id, {
      populate: [
        'order',
        'customer_name',
        'receive_address',
        'receive_address.address_three_levels',
        'products',
        'products.inventory_item',
        'products.inventory_item.sku_quantity',
        'products.inventory_item.sku_quantity.sku',
        'products.inventory_item.sku_quantity.sku.product',
        'products.inventory_item.sku_quantity.sku.color',
        'products.inventory_item.sku_quantity.sku.pattern',
        'products.inventory_item.sku_quantity.sku.stretch',
        'products.inventory_item.sku_quantity.sku.width',
        'products.inventory_item.sku_quantity.sku.origin',
        'products.inventory_item.sku_quantity.sku.images',
        'order_payment_invoices',
      ]
    });
    const data = {
      id: invoice.id,
      createdAt: invoice.createdAt,
      customer_name: invoice.customer_name,
      customer_phone: invoice.customer_phone,
      receive_address: invoice.receive_address,
      products: invoice.products.map((item, index) => {
        const price = parseInt(item.inventory_item.sku_quantity.sku.price);
        const length = parseInt(item.length);
        const sku = item.inventory_item.sku_quantity.sku;
        let descriptions = [];
        if (sku.color) descriptions.push(`Màu sắc: ${sku.color.name}`);
        if (sku.pattern) descriptions.push(`Kiểu mẫu: ${sku.pattern.name}`);
        if (sku.width) descriptions.push(`Chiều rộng: ${sku.width.name}`);
        if (sku.stretch) descriptions.push(`Co giãn: ${sku.stretch.name}`);
        if (sku.origin) descriptions.push(`Xuất xứ: ${sku.origin.name}`);
        return {
          index: index + 1,
          inventory_id: item.inventory_item.id,
          name: item.inventory_item.sku_quantity.sku.product.name,
          code: item.inventory_item.sku_quantity.sku.sku,
          descriptions: descriptions,
          price: price.toLocaleString(),
          length: length,
          subAmount: (price * length * 0.01).toLocaleString(),
        };
      }),
      orderAmount: invoice.products.reduce((sum, item) => {
        const price = parseInt(item.inventory_item.sku_quantity.sku.price);
        const length = parseInt(item.length);
        return sum + price * length * 0.01;
      }, 0).toLocaleString(),
      order_payment_invoices: invoice.order_payment_invoices.map((item) => {
        return { createdAt: item.createdAt, amount: parseInt(item.amount).toLocaleString() }
      }),
      paymentAmount: invoice.order_payment_invoices.reduce((sum, item) => {
        return sum + parseInt(item.amount);
      }, 0).toLocaleString(),
      invoiceAmount: parseInt(invoice.price).toLocaleString(),
      debtAmount: (parseInt(invoice.price) - invoice.order_payment_invoices.reduce((sum, item) => {
        return sum + parseInt(item.amount);
      }, 0)).toLocaleString(),
    }
    const templateFilePath = './data/template/template-order-invoice.html';
    await strapi.service('api::export-pdf.export-pdf').exportPdf(ctx, templateFilePath, data);
  }
};
