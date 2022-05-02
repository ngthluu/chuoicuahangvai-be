module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/user-schedule',
      handler: 'user-schedule.getSchedules',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
  