module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/vnpay/return_url',
     handler: 'vnpay.handleReturnUrl',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
      method: 'GET',
      path: '/vnpay/ipn_url',
      handler: 'vnpay.handleIPNUrl',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
