import { json, redirect } from '@remix-run/cloudflare';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { isUnlocked } from '~/utils/extra-session.server';
import styles from './admin.module.css';

export function meta() {
  return [
    { title: 'Write a post' },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
}

export async function loader({ request, context }) {
  if (!(await isUnlocked(request, context))) {
    throw redirect('/extracurricular');
  }
  return json(null, { headers: { 'Cache-Control': 'no-store' } });
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

export async function action({ request, context }) {
  if (!(await isUnlocked(request, context))) {
    throw redirect('/extracurricular');
  }

  const kv = context.cloudflare.env.BLOG_KV;
  if (!kv) {
    return json(
      { error: 'Blog storage (KV) is not bound on the server yet.' },
      { status: 500 }
    );
  }

  const form = await request.formData();
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

  // Store the clipping bytes and the post (with light metadata for fast listing).
  await kv.put(`pdf:${slug}`, await pdf.arrayBuffer());
  await kv.put(`post:${slug}`, JSON.stringify({ title, abstract, body, date }), {
    metadata: { title, abstract, date },
  });

  return json({ ok: true, slug });
}

export default function Admin() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const publishing = navigation.state === 'submitting';

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.label}>// Private</span>
        <h1 className={styles.title}>Write a post</h1>
        <p className={styles.tagline}>
          Fill this in, attach the newspaper PDF, and hit publish. It saves
          straight to the site — your post is live immediately, no waiting.
        </p>
      </section>

      <div className={styles.body}>
        {actionData?.ok ? (
          <div className={styles.success}>
            <p>
              ✅ Published. It’s live now at <code>/blog/{actionData.slug}</code>.
            </p>
            <a className={styles.link} href={`/blog/${actionData.slug}`}>
              View it →
            </a>{' '}
            <a className={styles.link} href="/admin">
              Write another →
            </a>
          </div>
        ) : (
          <Form method="post" encType="multipart/form-data" className={styles.form}>
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
              <input
                className={styles.input}
                name="pdf"
                type="file"
                accept="application/pdf"
                required
              />
            </label>
            <button className={styles.submit} type="submit" disabled={publishing}>
              {publishing ? 'Publishing…' : 'Publish'}
            </button>
            {actionData?.error ? (
              <p className={styles.error}>{actionData.error}</p>
            ) : null}
          </Form>
        )}
      </div>
    </div>
  );
}
