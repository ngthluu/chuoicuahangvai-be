module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/vouchers-available',
       handler: 'voucher.getAvailableVouchers',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  