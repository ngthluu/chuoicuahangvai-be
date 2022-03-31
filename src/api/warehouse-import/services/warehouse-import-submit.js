'use strict';

/**
 * warehouse-import-submit service.
 */

module.exports = () => ({
    async submitImport(id, userId) {
        const importData = await strapi.entityService.findOne('api::warehouse-import.warehouse-import', id, {
            fields: ['id', 'note'],
            populate: ['branch', 'products', 'products', 'products.sku'],
        });
        // Update data to inventory table
        importData.products.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
                strapi.entityService.create('api::warehouse-inventory.warehouse-inventory', {
                    data: {
                        sku_quantity: {
                            sku: item.sku.id,
                            length: item.length,
                            quantity: 1,
                        },
                        branch: importData.branch.id,
                    }
                });
            }
        });
        // Update import status
        strapi.entityService.update('api::warehouse-import.warehouse-import', id, {
            data: {
                submit_status: true,
                submit_user: userId,
                submit_time: (new Date()).toISOString(),
            }
        });
    }
});
