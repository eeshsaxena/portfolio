import { json, redirect } from '@remix-run/cloudflare';
import { Form, Link as RouterLink, useLoaderData, useActionData, useNavigation } from '@remix-run/react';
import { DecoderText } from '~/components/decoder-text';
import { Footer } from '~/components/footer';
import { ACTIVITIES, INTERESTS, CP } from './data.server';
import { extraSession as sessionStorage } from '~/utils/extra-session.server';
import styles from './extracurricular.module.css';

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
      cp: authed ? CP : [],
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
  const { authed, activities, interests, cp } = useLoaderData();
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
            <div className={styles.gatedLinks}>
              <RouterLink prefetch="intent" to="/blog" className={styles.blogLink}>
                📰 Read my newspaper blog →
              </RouterLink>
              <RouterLink prefetch="intent" to="/admin" className={styles.blogLink}>
                ✍️ Write a new post →
              </RouterLink>
            </div>

            <h3 className={styles.sub}>Activities</h3>
            <ul className={styles.points}>
              {activities.map((a, i) => (
                <li key={i} className={styles.point}>
                  <div className={styles.pointHead}>
                    <span className={styles.pointTitle}>{a.role}</span>
                    {a.org ? <span className={styles.pointOrg}>{a.org}</span> : null}
                    {a.period ? (
                      <span className={styles.pointMeta}>{a.period}</span>
                    ) : null}
                    {a.url ? (
                      <a
                        className={styles.pointLink}
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read ↗
                      </a>
                    ) : null}
                  </div>
                  {a.note ? <p className={styles.pointNote}>{a.note}</p> : null}
                </li>
              ))}
            </ul>

            <h3 className={styles.sub}>Competitive Programming</h3>
            <div className={styles.cpGrid}>
              {cp.map(p => (
                <a
                  key={p.platform}
                  className={styles.cpCard}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.cpPlatform}>{p.platform}</span>
                  <span className={styles.cpRank}>{p.rank}</span>
                  <span className={styles.cpRating}>{p.rating}</span>
                </a>
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
