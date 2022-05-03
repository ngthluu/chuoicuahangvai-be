'use strict';

module.exports = {
  print: async (ctx, next) => {
    const { id } = ctx.params;
    const invoice = await strapi.entityService.findOne('api::refund-invoice.refund-invoice', id, {
      populate: [
        'refund',
        'customer_name',
        'products',
        'products.sku',
        'products.sku.product',
        'products.sku.color',
        'products.sku.pattern',
        'products.sku.stretch',
        'products.sku.width',
        'products.sku.origin',
        'products.sku.images',
      ]
    });
    const data = {
      id: invoice.id,
      createdAt: invoice.createdAt,
      customer_name: invoice.customer_name,
      customer_phone: invoice.customer_phone,
      receive_address: invoice.receive_address,
      products: invoice.products.map((item, index) => {
        const price = parseInt(item.sku.price);
        const length = parseInt(item.length);
        const sku = item.sku;
        let descriptions = [];
        if (sku.color) descriptions.push(`Màu sắc: ${sku.color.name}`);
        if (sku.pattern) descriptions.push(`Kiểu mẫu: ${sku.pattern.name}`);
        if (sku.width) descriptions.push(`Chiều rộng: ${sku.width.name}`);
        if (sku.stretch) descriptions.push(`Co giãn: ${sku.stretch.name}`);
        if (sku.origin) descriptions.push(`Xuất xứ: ${sku.origin.name}`);
        return {
          index: index + 1,
          name: item.sku.product.name,
          code: item.sku.sku,
          descriptions: descriptions,
          price: price.toLocaleString(),
          length: length,
          subAmount: (price * length * 0.01).toLocaleString(),
        };
      }),
      refundAmount: invoice.products.reduce((sum, item) => {
        const price = parseInt(item.sku.price);
        const length = parseInt(item.length);
        return sum + price * length * 0.01;
      }, 0).toLocaleString(),
      invoiceAmount: parseInt(invoice.price).toLocaleString(),
    }
    const templateFilePath = './data/template/template-refund-invoice.html';
    await strapi.service('api::export-pdf.export-pdf').exportPdf(ctx, templateFilePath, data);
  }
};
