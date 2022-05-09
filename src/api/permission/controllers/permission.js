'use strict';

const utils = require('@strapi/utils');
const { ApplicationError } = utils.errors;

module.exports = {
  checkPermission: async (ctx, next) => {
    const { moduleName, functionName } = ctx.request.body;
    const result = await strapi
        .service('api::permission.permission')
        .checkPermission(ctx, moduleName, functionName);
    
    if (!result) {
        throw new ApplicationError('Permission denied');
    }

    ctx.body = 'ok';
  }
};
