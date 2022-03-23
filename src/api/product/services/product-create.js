'use strict';

/**
 * product-create service.
 */

module.exports = () => ({
    async createProductWithSKU(data) {
        let { name, category, description, skus } = data;
        const product = await strapi.db.query('api::product.product').create({
            data: {
                name: name,
                category: category,
                description: description,
            }
        });
        skus = skus.map(skuItem => ({
            sku: skuItem.attributes.sku,
            price: skuItem.attributes.price,
            color: skuItem.attributes.color,
            product: product.id,
            origin: skuItem.attributes.origin.data.id,
            width: skuItem.attributes.width.data.id,
            stretch: skuItem.attributes.stretch.data.id,
            pattern: skuItem.attributes.pattern.data.id,
        }))
        for (const sku of skus) {
            await strapi.db.query('api::product-sku.product-sku').create({ data: sku });
        }
    }
});
