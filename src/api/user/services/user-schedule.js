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
        const days = { mo: item.shift.monday, tu: item.shift.tuesday, we: item.shift.wednesday, th: item.shift.thursday, fr: item.shift.friday, sa: item.shift.saturday, su: item.shift.sunday};
        let daysOfWeekMorning = [];
        let daysOfWeekAfternoon = [];
        let daysOfWeekNight = [];
        for (const [key, value] of Object.entries(days)) {
          if (value.morning) daysOfWeekMorning.push(key);
          if (value.afternoon) daysOfWeekAfternoon.push(key);
          if (value.night) daysOfWeekNight.push(key);
        }
        const userLeaves = leaves
          .filter((leave) => leave.user.id === item.id)
          .map((leave) => ({ 
            freq: 'minutely', 
            dtstart: leave.from.slice(0, -1), 
            until: leave.to.slice(0, -1) 
          }));
        
        return [
          {
            title: item.email,
            color: getColor(item.role.name),
            rrule: { freq: 'weekly', byweekday: daysOfWeekMorning, dtstart: '0001-01-01T06:00:00' },
            duration: '06:00',
            exrule: userLeaves,
          },
          {
            title: item.email,
            color: getColor(item.role.name),
            rrule: { freq: 'weekly', byweekday: daysOfWeekAfternoon, dtstart: '0001-01-01T12:00:00' },
            duration: '06:00',
            exrule: userLeaves,
          },
          { 
            title: item.email,
            color: getColor(item.role.name),
            rrule: { freq: 'weekly', byweekday: daysOfWeekNight, dtstart: '0001-01-01T18:00:00' },
            duration: '06:00',
            exrule: userLeaves, 
          },
        ];
      })
      .flat()
      .filter((item) => item.rrule.byweekday.length > 0);

    return data;
  },
});