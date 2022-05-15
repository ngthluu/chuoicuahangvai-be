const Strapi = require('@strapi/strapi');

let instance;

async function setupStrapi() {
  if (!instance) {
    await Strapi().load();
    instance = strapi;
    await instance.server
      .use(instance.server.router.routes())
      .use(instance.server.router.allowedMethods());

    await instance.server.mount(); 
  }
  return instance;
}
module.exports = { setupStrapi };