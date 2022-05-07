'use strict';

const { yup, validateYupSchema } = require('@strapi/utils');
const resetPasswordSchema = yup.object().shape({
  currentPassword: yup.string().required(),
  newPassword: yup.string().required(),
  rePassword: yup.string().oneOf([yup.ref('newPassword'), null], "Passwords don't match").required('Confirm Password is required'),
});

module.exports = {
  resetPassword: async (ctx, next) => {
    await validateYupSchema(resetPasswordSchema)(ctx.request.body);
    
    const { user } = ctx.state;
    const { currentPassword, newPassword } = ctx.request.body;
    
    await strapi.service('api::user.user-password').resetPassword({user, currentPassword, newPassword});
    ctx.body = 'ok';
  },
};
