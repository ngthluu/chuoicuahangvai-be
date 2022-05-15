const fs = require('fs');
const { setupStrapi } = require('./helpers/strapi');

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  const dbSettings = strapi.config.get('database.connection.connection');
  
  await strapi.server.destroy();

  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${dbSettings.filename}`;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
});

require('./testcases');