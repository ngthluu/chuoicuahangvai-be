module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'fbaa0e4095ff8c876cd73f5628cf32c6'),
  },
});
