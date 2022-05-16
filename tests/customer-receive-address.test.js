const fs = require('fs');
const { setupStrapi } = require('./helpers/strapi');

jest.setTimeout(30000);

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  const dbSettings = strapi.config.get('database.connection.connection');
  
  await strapi.destroy();

  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${dbSettings.filename}`;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
});

it('Test case 01', async () => true);
it('Test case 02', async () => true);
it('Test case 03', async () => true);
it('Test case 04', async () => true);
it('Test case 05', async () => true);
it('Test case 06', async () => true);
it('Test case 07', async () => true);