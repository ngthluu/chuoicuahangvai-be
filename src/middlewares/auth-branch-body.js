const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

module.exports = (config, { strapi })=> {
  return async (ctx, next) => {
    const { user } = ctx.state;

    if (!user) throw new ApplicationError('Authentication required');
    const userWithBranchData = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
      populate: ['branch', 'branches']
    });
    let userBranchIdList = [];
    if (userWithBranchData.branch) userBranchIdList.push(userWithBranchData.branch.id);
    for (let branch of userWithBranchData.branches) userBranchIdList.push(branch.id);

    if (user.role.name == 'Super Admin') {}
    else {
      const { branch, ..._ } = ctx.request.body;
      if (!(branch && branch.id && userBranchIdList.includes(branch.id))) {
        throw new ApplicationError('Branch is not valid');
      }
    }

    await next();
  };
};