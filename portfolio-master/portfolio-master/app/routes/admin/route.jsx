import { json, redirect } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { isAdmin, adminSession } from '~/utils/extra-session.server';
import { formatDate } from '~/utils/date';
import styles from './admin.module.css';

export function meta() {
  return [
    { title: 'Admin' },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
}

function slugify(s) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || `post-${Date.now()}`
  );
}

export async function loader({ request, context }) {
  const admin = await isAdmin(request, context);
  if (!admin) {
    return json({ authed: false, posts: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
  const kv = context.cloudflare.env.BLOG_KV;
  const list = kv ? await kv.list({ prefix: 'post:' }) : { keys: [] };
  const posts = list.keys
    .map(k => ({ slug: k.name.replace(/^post:/, ''), ...(k.metadata || {}) }))
    .sort((a, b) => ((a.date || '') < (b.date || '') ? 1 : -1));
  return json({ authed: true, posts }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function action({ request, context }) {
  const form = await request.formData();
  const intent = form.get('intent');
  const { getSession, commitSession } = adminSession(context);

  // ── Owner login ──
  if (intent === 'login') {
    const password = String(form.get('password') || '');
    const expected = context.cloudflare.env.ADMIN_PASSWORD || '';
    if (expected && password === expected) {
      const session = await getSession(request.headers.get('Cookie'));
      session.set('admin', true);
      return redirect('/admin', {
        headers: { 'Set-Cookie': await commitSession(session) },
      });
    }
    return json({ error: 'Wrong admin password.' }, { status: 401 });
  }

  // Everything below requires the owner.
  if (!(await isAdmin(request, context))) {
    throw redirect('/admin');
  }
  const kv = context.cloudflare.env.BLOG_KV;
  if (!kv) {
    return json({ error: 'Blog storage (KV) is not bound.' }, { status: 500 });
  }

  // ── Delete a post ──
  if (intent === 'delete') {
    const slug = String(form.get('slug') || '');
    if (slug) {
      await kv.delete(`post:${slug}`);
      await kv.delete(`pdf:${slug}`);
    }
    return redirect('/admin');
  }

  // ── Publish a new post ──
  const title = String(form.get('title') || '').trim();
  const abstract = String(form.get('abstract') || '').trim();
  const body = String(form.get('body') || '').trim();
  const pdf = form.get('pdf');

  if (!title || !body) {
    return json({ error: 'Title and writeup are required.' }, { status: 400 });
  }
  if (!pdf || typeof pdf === 'string' || pdf.size === 0) {
    return json({ error: 'Please attach a PDF.' }, { status: 400 });
  }
  if (pdf.size > 20 * 1024 * 1024) {
    return json({ error: 'PDF is too large (keep it under 20 MB).' }, { status: 400 });
  }

  const slug = slugify(title);
  const date = new Date().toISOString().slice(0, 10);
  await kv.put(`pdf:${slug}`, await pdf.arrayBuffer());
  await kv.put(`post:${slug}`, JSON.stringify({ title, abstract, body, date }), {
    metadata: { title, abstract, date },
  });

  return json({ ok: true, slug });
}

export default function Admin() {
  const { authed, posts } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const busy = navigation.state === 'submitting';

  if (!authed) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <span className={styles.label}>// Owner only</span>
          <h1 className={styles.title}>Admin</h1>
        </section>
        <div className={styles.body}>
          <Form method="post" className={styles.gate}>
            <input type="hidden" name="intent" value="login" />
            <p className={styles.gateText}>Enter the admin password to manage posts.</p>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Admin password"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              autoFocus
              required
            />
            <button className={styles.submit} type="submit" disabled={busy}>
              {busy ? 'Checking…' : 'Unlock admin'}
            </button>
            {actionData?.error ? <p className={styles.error}>{actionData.error}</p> : null}
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.label}>// Private</span>
        <h1 className={styles.title}>Write a post</h1>
        <p className={styles.tagline}>
          Fill this in, attach the PDF, and publish — it’s live immediately.
        </p>
      </section>

      <div className={styles.body}>
        {actionData?.ok ? (
          <div className={styles.success}>
            <p>
              ✅ Published. It’s live now at <code>/blog/{actionData.slug}</code>.
            </p>
            <a className={styles.link} href={`/blog/${actionData.slug}`}>View it →</a>{' '}
            <a className={styles.link} href="/admin">Write another →</a>
          </div>
        ) : (
          <Form method="post" encType="multipart/form-data" className={styles.form}>
            <input type="hidden" name="intent" value="create" />
            <label className={styles.field}>
              <span>Title</span>
              <input className={styles.input} name="title" type="text" required />
            </label>
            <label className={styles.field}>
              <span>One-line summary (optional)</span>
              <input className={styles.input} name="abstract" type="text" />
            </label>
            <label className={styles.field}>
              <span>Writeup (Markdown supported)</span>
              <textarea className={styles.textarea} name="body" rows={12} required />
            </label>
            <label className={styles.field}>
              <span>Newspaper PDF (max 20 MB)</span>
              <input className={styles.input} name="pdf" type="file" accept="application/pdf" required />
            </label>
            <button className={styles.submit} type="submit" disabled={busy}>
              {busy ? 'Publishing…' : 'Publish'}
            </button>
            {actionData?.error ? <p className={styles.error}>{actionData.error}</p> : null}
          </Form>
        )}

        <h2 className={styles.listHeading}>Existing posts</h2>
        {posts.length === 0 ? (
          <p className={styles.empty}>No posts yet.</p>
        ) : (
          <ul className={styles.postList}>
            {posts.map(p => (
              <li key={p.slug} className={styles.postRow}>
                <div className={styles.postInfo}>
                  <a className={styles.postTitle} href={`/blog/${p.slug}`}>
                    {p.title || p.slug}
                  </a>
                  {p.date ? <span className={styles.postDate}>{formatDate(p.date)}</span> : null}
                </div>
                <Form
                  method="post"
                  onSubmit={e => {
                    if (!confirm(`Delete “${p.title || p.slug}”? This can’t be undone.`)) {
                      e.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="slug" value={p.slug} />
                  <button className={styles.deleteBtn} type="submit">
                    Delete
                  </button>
                </Form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
