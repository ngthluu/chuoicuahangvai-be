'use strict';

module.exports = {
  print: async (ctx, next) => {
    try {
      const { id } = ctx.params;
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
