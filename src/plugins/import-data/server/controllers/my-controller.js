'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('import-data')
      .service('myService')
      .getWelcomeMessage();
  },
};
