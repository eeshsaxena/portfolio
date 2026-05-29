import { json, redirect } from '@remix-run/cloudflare';
import {
  Form,
  Link as RouterLink,
  useLoaderData,
  useActionData,
  useNavigation,
} from '@remix-run/react';
import { DecoderText } from '~/components/decoder-text';
import { Footer } from '~/components/footer';
import { extraSession as sessionStorage, isAdmin } from '~/utils/extra-session.server';
import styles from './extracurricular.module.css';

export function meta() {
  return [
    { title: 'Eesh Saxena | Writing' },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
}

export async function loader({ request, context }) {
  const { getSession } = sessionStorage(context);
  const session = await getSession(request.headers.get('Cookie'));
  const admin = await isAdmin(request, context);
  const authed = session.get('authed') === true || admin;
  return json(
    { authed, admin },
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

export default function Writing() {
  const { authed, admin } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.label}>// Writing</span>
          <h1 className={styles.title}>
            <DecoderText text="Newspaper" delay={300} />
          </h1>
        </div>
        <p className={styles.tagline}>
          The pieces I’ve written for the press, with the original clippings.
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
            {actionData?.error ? <p className={styles.error}>{actionData.error}</p> : null}
          </Form>
        ) : (
          <div className={styles.gatedLinks}>
            <RouterLink prefetch="intent" to="/blog" className={styles.blogLink}>
              📰 Read the newspaper blog →
            </RouterLink>
            {admin ? (
              <RouterLink prefetch="intent" to="/admin" className={styles.blogLink}>
                ✍️ Write a new post →
              </RouterLink>
            ) : null}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
