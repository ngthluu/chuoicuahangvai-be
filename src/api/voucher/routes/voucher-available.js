module.exports = {
    routes: [
      {
       method: 'GET',
       path: '/vouchers-available',
       handler: 'voucher.getAvailableVouchers',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  