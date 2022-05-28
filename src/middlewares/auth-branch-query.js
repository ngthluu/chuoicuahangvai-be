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
      const { filters } = ctx.query;
      if (!filters) {
        ctx.query.filters = { branch: { id: { $in: userBranchIdList } } };
      } else {
        const { branch, ..._ } = filters;
        if (branch) {
          ctx.query.filters = {
            ..._, 
            branch: { 
              $and: [ { id: { $in: userBranchIdList } }, ...Object.entries(branch).map(([i, v]) => ({[i]: v})) ] 
            }
          };
        } else {
          ctx.query.filters = {
            ...filters,
            branch: { id: { $in: userBranchIdList } }
          };
        }
      }
    }

    await next();
  };
};