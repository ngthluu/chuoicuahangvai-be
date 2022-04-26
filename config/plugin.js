module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('lvtnchuoicuahangvaile@gmail.com'),
          pass: env('0383477379'),
        },
      },
      settings: {
        defaultFrom: 'lvtnchuoicuahangvaile@gmail.com',
        defaultReplyTo: 'lvtnchuoicuahangvaile@gmail.com',
      },
    },
  },
});