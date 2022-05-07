'use strict';

const utils = require('@strapi/utils');
const { ValidationError } = utils.errors;

module.exports = () => ({
  async resetPassword({user, currentPassword, newPassword}) {
    const isValid = await strapi
      .plugin('users-permissions')
      .service('user')
      .validatePassword(currentPassword, user.password);
    if (!isValid) {
      throw new ValidationError('Invalid identifier or password');
    }
    await strapi
      .plugin('users-permissions')
      .service('user')
      .edit(user.id, { password: newPassword });
    
    return true;
  },
});
