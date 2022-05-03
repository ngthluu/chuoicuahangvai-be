'use strict';

const utils = require('@strapi/utils');
const { ValidationError } = utils.errors;

module.exports = () => ({
  async approve(id, user) {
    if (user.role.name !== 'Super Admin' && user.role.name !== 'Branch Manager') {
      throw new ValidationError('Permission denied');
    }
    const userLeave = await strapi.entityService.findOne('api::user-leave.user-leave', id);
    if (!userLeave || userLeave.approved) {
      throw new ValidationError('This leave is approved');
    }
    await strapi.entityService.update('api::user-leave.user-leave', id, {
      data: {
        approved: true,
        approved_time: (new Date()).toISOString(),
        approved_user: user.id,
      },
    });
    return 'ok';
  }
});
