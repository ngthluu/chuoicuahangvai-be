'use strict';

/**
 * three-levels service.
 */

module.exports = () => ({
    async listAllCity(...args) {
        const data = await strapi.db.query('api::address.address').findMany({
            select: ['city'],
            orderBy: { city: 'asc' },
        });
        let hashTable = {};
        data.forEach(item => {
            if (!hashTable.hasOwnProperty(item.city)) {
                hashTable[item.city] = true;
            }
        });
        let response = [];
        for (const [key, value] of Object.entries(hashTable)) {
            response.push(key);
        }
        return response;
    },

    async listAllDistrictsOfCity(city) {
        const data = await strapi.db.query('api::address.address').findMany({
            select: ['district'],
            where: { city: city },
            orderBy: { district: 'asc' },
        });
        let hashTable = {};
        data.forEach(item => {
            if (!hashTable.hasOwnProperty(item.district)) {
                hashTable[item.district] = true;
            }
        });
        let response = [];
        for (const [key, value] of Object.entries(hashTable)) {
            response.push(key);
        }
        return response;
    },

    async listAllWardsOfDistrict(district, city) {
        const data = await strapi.db.query('api::address.address').findMany({
            select: ['id', 'ward'],
            where: { district: district, city: city },
            orderBy: { ward: 'asc' },
        });
        let hashTable = {};
        data.forEach(item => {
            if (!hashTable.hasOwnProperty(item.ward)) {
                hashTable[item.ward] = item.id;
            }
        });
        let response = [];
        for (const [label, value] of Object.entries(hashTable)) {
            response.push({value: value, label: label});
        }
        return response;
    },
});
