'use strict';

/**
 * product-update service.
 */

module.exports = () => ({
    async updateProductWithSKU(id, data) {
        let { name, category, description, skus } = data;
        const product = await strapi.db.query('api::product.product').update({
            where: { id: id },
            data: {
                name: name,
                category: category !== '' ? category : null,
                description: description,
            }
        });
        for (const skuItem of skus) {
            const skuItemId = skuItem.id;
            const sku = {
                sku: skuItem.attributes.sku,
                price: skuItem.attributes.price,
                product: id,
                images: skuItem.attributes.images.data,
                color: skuItem.attributes.color.data ? skuItem.attributes.color.data.id : null,
                origin: skuItem.attributes.origin.data ? skuItem.attributes.origin.data.id : null,
                width: skuItem.attributes.width.data ? skuItem.attributes.width.data.id : null,
                stretch: skuItem.attributes.stretch.data ? skuItem.attributes.stretch.data.id : null,
                pattern: skuItem.attributes.pattern.data ? skuItem.attributes.pattern.data.id : null,
            }
            if (skuItemId === null) {
                await strapi.db.query('api::product-sku.product-sku').create({ data: sku });
            } else {
                await strapi.db.query('api::product-sku.product-sku').update({ 
                    where: { id: skuItemId }, data: sku
                });
            }
        }
    }
});
