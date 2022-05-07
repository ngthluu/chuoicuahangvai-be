module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/order-delivery-success/:id',
        handler: 'order-delivery-success.deliverySuccess',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
    