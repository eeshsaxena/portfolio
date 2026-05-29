import { json, redirect, createCookieSessionStorage } from '@remix-run/cloudflare';
import { Form, useLoaderData, useActionData, useNavigation } from '@remix-run/react';
import { DecoderText } from '~/components/decoder-text';
import { Footer } from '~/components/footer';
import { ACTIVITIES, INTERESTS } from './data.server';
import styles from './extracurricular.module.css';

function sessionStorage(context) {
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

export function meta() {
  return [
    { title: 'Eesh Saxena | Extracurricular' },
    // Private section — keep it out of search results.
    { name: 'robots', content: 'noindex, nofollow' },
  ];
}

export async function loader({ request, context }) {
  const { getSession } = sessionStorage(context);
  const session = await getSession(request.headers.get('Cookie'));
  const authed = session.get('authed') === true;
  return json(
    {
      authed,
      activities: authed ? ACTIVITIES : [],
      interests: authed ? INTERESTS : [],
    },
    // Gated + cookie-dependent: never cache at the edge or in the browser.
    { headers: { 'Cache-Control': 'no-store, must-revalidate' } }
  );
}

export async function action({ request, context }) {
  const form = await request.formData();
  const password = String(form.get('password') || '');
  const expected = context.cloudflare.env.EXTRA_PASSWORD || '';
  const { getSession, commitSession } = sessionStorage(context);
  const session = await getSession(request.headers.get('Cookie'));

  if (expected && password === expected) {
    session.set('authed', true);
    return redirect('/extracurricular', {
      headers: { 'Set-Cookie': await commitSession(session) },
    });
  }
  return json(
    { error: 'You are not allowed. The password is incorrect.' },
    { status: 401 }
  );
}

export default function Extracurricular() {
  const { authed, activities, interests } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.label}>// Beyond Code</span>
          <h1 className={styles.title}>
            <DecoderText text="Extracurricular" delay={300} />
          </h1>
        </div>
        <p className={styles.tagline}>
          Clubs, mentoring, and the things I get up to outside of work.
        </p>
      </section>

      <div className={styles.body}>
        {!authed ? (
          <Form method="post" className={styles.gate}>
            <div className={styles.lock} aria-hidden="true">🔒</div>
            <p className={styles.gateText}>
              This section is private. Enter the password to view it.
            </p>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              autoFocus
              required
            />
            <button className={styles.submit} type="submit" disabled={submitting}>
              {submitting ? 'Checking…' : 'Unlock'}
            </button>
            {actionData?.error && <p className={styles.error}>{actionData.error}</p>}
          </Form>
        ) : (
          <>
            <div className={styles.timeline}>
              {activities.map((a, i) => (
                <article key={i} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div>
                      <h2 className={styles.role}>{a.role}</h2>
                      <p className={styles.org}>
                        {a.org}
                        {a.period ? (
                          <span className={styles.period}> · {a.period}</span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                  {a.note ? <p className={styles.note}>{a.note}</p> : null}
                </article>
              ))}
            </div>

            <h3 className={styles.sub}>Interests</h3>
            <div className={styles.tags}>
              {interests.map(t => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
