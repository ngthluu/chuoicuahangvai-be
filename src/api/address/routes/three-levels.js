module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/cities',
            handler: 'three-levels.listAllCity',
        },
        {
            method: 'GET',
            path: '/districts',
            handler: 'three-levels.listAllDistrictsOfCity',
        },
        {
            method: 'GET',
            path: '/wards',
            handler: 'three-levels.listAllWardsOfDistrict',
        }
    ]
}