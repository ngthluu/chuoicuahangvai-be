'use strict';

/**
 * warehouse-catalogue-submit service.
 */

const getCatalogueData = async (id) => {
    const catalogueData = await strapi.entityService.findOne('api::warehouse-catalogue.warehouse-catalogue', id, {
        populate: ['branch', 'products', 'products.inventory_item'],
    });
    return catalogueData;
}

const updateInventory = async (catalogueProductItem) => {
    const inventoryId = catalogueProductItem.inventory_item.id;
    const inventoryItem = await strapi.entityService.findOne('api::warehouse-inventory.warehouse-inventory', inventoryId, {
        populate: ['sku_quantity'],
    });
    strapi.entityService.update('api::warehouse-inventory.warehouse-inventory', inventoryId, {
        data: {
            sku_quantity: {
                id: inventoryItem.sku_quantity.id,
                length: catalogueProductItem.length,
            },
        }
    });
}

const updateSubmitStatus = async (id, userId) => {
    strapi.entityService.update('api::warehouse-catalogue.warehouse-catalogue', id, {
        data: {
            submit_status: true,
            submit_user: userId,
            submit_time: (new Date()).toISOString(),
        }
    });
}

module.exports = () => ({
    async submitCatalogue(id, userId) {
        const catalogueData = await getCatalogueData(id);
        catalogueData.products.forEach(item => updateInventory(item));
        updateSubmitStatus(id, userId)
    }
});
