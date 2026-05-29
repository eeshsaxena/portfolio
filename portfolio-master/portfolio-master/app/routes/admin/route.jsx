import { json, redirect } from '@remix-run/cloudflare';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { isUnlocked } from '~/utils/extra-session.server';
import styles from './admin.module.css';

const REPO = 'eeshsaxena/portfolio';
const BASE = 'portfolio-master/portfolio-master';

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

const yaml = s => `'${String(s).replace(/'/g, "''")}'`;

function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function bytesToBase64(bytes) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function ghPut(token, path, contentBase64, message) {
  const url = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'eeshsaxena-portfolio-writer',
    'Content-Type': 'application/json',
  };

  // If the file already exists we need its sha to overwrite it.
  let sha;
  const head = await fetch(`${url}?ref=main`, { headers });
  if (head.ok) sha = (await head.json()).sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: 'main',
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub ${path} -> ${res.status}: ${await res.text()}`);
  }
}

export async function action({ request, context }) {
  if (!(await isUnlocked(request, context))) {
    throw redirect('/extracurricular');
  }

  const token = context.cloudflare.env.GITHUB_TOKEN;
  if (!token) {
    return json(
      { error: 'GITHUB_TOKEN is not configured on the server yet.' },
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
  if (pdf.size > 8 * 1024 * 1024) {
    return json({ error: 'PDF is too large (keep it under 8 MB).' }, { status: 400 });
  }

  const slug = slugify(title);
  const date = new Date().toISOString().slice(0, 10);

  const mdx = `---
title: ${yaml(title)}
abstract: ${yaml(abstract || title)}
date: ${yaml(date)}
pdf: /blog/${slug}.pdf
---

${body}
`;

  try {
    const pdfBytes = new Uint8Array(await pdf.arrayBuffer());
    await ghPut(
      token,
      `${BASE}/public/blog/${slug}.pdf`,
      bytesToBase64(pdfBytes),
      `blog: upload clipping for "${title}"`
    );
    await ghPut(
      token,
      `${BASE}/app/routes/blog.${slug}.mdx`,
      utf8ToBase64(mdx),
      `blog: publish "${title}"`
    );
  } catch (e) {
    return json({ error: `Publish failed: ${e.message}` }, { status: 502 });
  }

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
          Fill this in, attach the newspaper PDF, and hit publish. It commits to
          GitHub and the site rebuilds itself in a minute or two.
        </p>
      </section>

      <div className={styles.body}>
        {actionData?.ok ? (
          <div className={styles.success}>
            <p>
              ✅ Published <strong>{actionData.slug}</strong>. It’ll be live at{' '}
              <code>/blog/{actionData.slug}</code> once the deploy finishes
              (~1–2 min).
            </p>
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
              <span>Newspaper PDF (max 8 MB)</span>
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
