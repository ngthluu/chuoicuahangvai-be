'use strict';

/**
 * warehouse-export-submit service.
 */

const getExportData = async (id) => {
    const exportData = await strapi.entityService.findOne('api::warehouse-export.warehouse-export', id, {
        populate: ['branch', 'products', 'products.inventory_item'],
    });
    return exportData;
}

const updateInventory = async (exportProductItem) => {
    const inventoryId = exportProductItem.inventory_item.id;
    const inventoryItem = await strapi.entityService.findOne('api::warehouse-inventory.warehouse-inventory', inventoryId, {
        populate: ['sku_quantity'],
    });
    strapi.log.info(JSON.stringify(inventoryItem));
    strapi.entityService.update('api::warehouse-inventory.warehouse-inventory', inventoryId, {
        data: {
            sku_quantity: {
                id: inventoryItem.sku_quantity.id,
                length: inventoryItem.sku_quantity.length - exportProductItem.length,
            },
        }
    });
}

const updateSubmitStatus = async (id, userId) => {
    strapi.entityService.update('api::warehouse-export.warehouse-export', id, {
        data: {
            submit_status: true,
            submit_user: userId,
            submit_time: (new Date()).toISOString(),
        }
    });
}

module.exports = () => ({
    async submitExport(id, userId) {
        const exportData = await getExportData(id);
        exportData.products.forEach(item => updateInventory(item));
        updateSubmitStatus(id, userId)
    }
});
