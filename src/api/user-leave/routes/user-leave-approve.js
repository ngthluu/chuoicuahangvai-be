module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/user-leaves-approve/:id',
      handler: 'user-leave-approve.approve',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
    