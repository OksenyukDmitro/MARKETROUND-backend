/* eslint-disable import/prefer-default-export */
export const authCheck = ctx => {
  if (!ctx.user) throw new Error('Not authorized');
  return true;
};
