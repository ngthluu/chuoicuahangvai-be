'use strict';

const getColor = (role) => {
  switch (role) {
    case 'Branch Manager': return '#e67c93';
    case 'Warehouse User': return '#83deb2';
    case 'Sales User': return '#6f98f7';
    default: return '#f2c16d';
  }
}

module.exports = () => ({
  async getSchedules(filters) {
    const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: filters,
      populate: [
        'role',
        'shift',
        'shift.monday',
        'shift.tuesday',
        'shift.wednesday',
        'shift.thursday',
        'shift.friday',
        'shift.saturday',
        'shift.sunday',
      ],
    });
    
    let leavesFilters = { approved: { $eq: true } }
    if (filters) leavesFilters = {...leavesFilters, user: filters }
    const leaves = await strapi.entityService.findMany('api::user-leave.user-leave', {
      filters: leavesFilters,
      populate: ['user'],
    });

    const data = users
      .map((item) => {
        if (!item.shift) return [];
        const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = item.shift;
        const days = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];
        let daysOfWeekMorning = [];
        let daysOfWeekAfternoon = [];
        let daysOfWeekNight = [];
        for (const i in days) {
          if (days[i].morning) daysOfWeekMorning.push(i);
          if (days[i].afternoon) daysOfWeekAfternoon.push(i);
          if (days[i].night) daysOfWeekNight.push(i);
        }
        const userLeaves = leaves
          .filter((leave) => leave.user.id === item.id)
          .map((leave) => ({ freq: 'yearly', dtstart: leave.from, until: leave.to }));
        return [
          { exrule: userLeaves, groupdId: item.email, title: item.email, color: getColor(item.role.name), daysOfWeek: daysOfWeekMorning, startTime: '06:00:00', endTime: '12:00:00'},
          { exrule: userLeaves, groupdId: item.email, title: item.email, color: getColor(item.role.name), daysOfWeek: daysOfWeekAfternoon, startTime: '12:00:00', endTime: '18:00:00'},
          { exrule: userLeaves, groupdId: item.email, title: item.email, color: getColor(item.role.name), daysOfWeek: daysOfWeekNight, startTime: '18:00:00', endTime: '24:00:00'},
        ]
      })
      .flat();

    return data;
  },
});