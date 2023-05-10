import { AUTH_TOKEN, COOKIE_DOMAIN } from './config';

export const setAuthCookie = async context => {
  await context.addCookies([
    {
      name: 'atoken',
      value: AUTH_TOKEN,
      domain: COOKIE_DOMAIN,
      path: '/',
    },
  ]);
};
