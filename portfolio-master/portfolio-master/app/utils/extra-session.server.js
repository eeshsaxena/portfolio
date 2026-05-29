import { createCookieSessionStorage } from '@remix-run/cloudflare';

// Shared session for the password-gated areas (Extracurricular + Blog).
// Both must use the exact same cookie name + secret so one unlock covers both.
export function extraSession(context) {
  return createCookieSessionStorage({
    cookie: {
      name: '__extra',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
      secrets: [context.cloudflare.env.SESSION_SECRET || 'dev-secret'],
      secure: true,
    },
  });
}

export async function isUnlocked(request, context) {
  const { getSession } = extraSession(context);
  const session = await getSession(request.headers.get('Cookie'));
  return session.get('authed') === true;
}
