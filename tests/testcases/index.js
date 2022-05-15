const request = require('supertest');

it('should login user and return jwt token', async () => {
  const mockUserData = {
    username: 'testeraaaaa',
    email: 'testeaaar@strapi.com',
    provider: 'local',
    password: '1234abc',
    confirmed: true,
    blocked: null,
  }
  await strapi.plugin('users-permissions').service('user').add({...mockUserData});
  
  await request(strapi.server.httpServer)
    .post('/auth/local')
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({
      identifier: mockUserData.email,
      password: mockUserData.password,
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
      expect(data.body.jwt).toBeDefined();
    });
});