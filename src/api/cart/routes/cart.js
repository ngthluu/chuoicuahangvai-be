module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/cart',
     handler: 'cart.stepCart',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
      method: 'POST',
      path: '/cart/information',
      handler: 'cart.stepInformation',
      config: {
        policies: [],
        middlewares: [],
      },
     },
     {
      method: 'POST',
      path: '/cart/delivery',
      handler: 'cart.stepDelivery',
      config: {
        policies: [],
        middlewares: [],
      },
     },
     {
      method: 'POST',
      path: '/cart/complete',
      handler: 'cart.stepComplete',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
