'use strict';

/**
 * A set of functions called "actions" for `warehouse-import-submit`
 */

module.exports = {
  submitImport: async (ctx, next) => {
    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
