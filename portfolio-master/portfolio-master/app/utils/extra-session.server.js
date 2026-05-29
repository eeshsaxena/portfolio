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

// Owner-only session for writing/deleting posts (separate, stronger gate than
// the shared read password).
export function adminSession(context) {
  return createCookieSessionStorage({
    cookie: {
      name: '__admin',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
      secrets: [context.cloudflare.env.SESSION_SECRET || 'dev-secret'],
      secure: true,
    },
  });
}

export async function isAdmin(request, context) {
  const { getSession } = adminSession(context);
  const session = await getSession(request.headers.get('Cookie'));
  return session.get('admin') === true;
}

export async function isUnlocked(request, context) {
  const { getSession } = extraSession(context);
  const session = await getSession(request.headers.get('Cookie'));
  if (session.get('authed') === true) return true;
  // The owner (admin) can always read the gated areas too.
  return isAdmin(request, context);
}
