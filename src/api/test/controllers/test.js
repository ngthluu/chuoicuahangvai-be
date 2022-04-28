'use strict';

/**
 * A set of functions called "actions" for `test`
 */

module.exports = {
  email: async (ctx, next) => {
    try {
      await strapi.plugins['email'].services.email.send({
        to: 'nguyenluu2101@gmail.com',
        subject: 'Use strapi email provider successfully',
        text: 'Hello world!',
        html: 'Hello world!',
      });
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
