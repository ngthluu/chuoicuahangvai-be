'use strict';

/**
 * product-delete service.
 */

module.exports = () => ({
    async deleteProductWithSKU(productId) {
        const skus = await strapi.db.query('api::product-sku.product-sku').findMany({
            where: { product: { id: productId } }
        });
        await strapi.db.query('api::product-sku.product-sku').deleteMany({
            where: { id: {$in: skus.map(sku => sku.id) } }
        });
        await strapi.db.query('api::product.product').delete({
             where: { id: productId } 
        });
    }
});
