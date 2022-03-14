module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/city',
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