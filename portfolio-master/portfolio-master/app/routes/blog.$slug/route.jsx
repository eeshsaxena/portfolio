import { json, redirect } from '@remix-run/cloudflare';
import { useLoaderData, Link as RouterLink } from '@remix-run/react';
import { marked } from 'marked';
import { Footer } from '~/components/footer';
import { formatDate } from '~/utils/date';
import { isUnlocked } from '~/utils/extra-session.server';
import styles from '../blog/blog.module.css';

export async function loader({ request, params, context }) {
  if (!(await isUnlocked(request, context))) {
    throw redirect('/extracurricular');
  }
  const kv = context.cloudflare.env.BLOG_KV;
  const raw = kv ? await kv.get(`post:${params.slug}`) : null;
  if (!raw) {
    throw new Response('Not found', { status: 404 });
  }
  const post = JSON.parse(raw);
  const html = marked.parse(post.body || '', { async: false });

  return json(
    {
      slug: params.slug,
      title: post.title,
      date: post.date,
      abstract: post.abstract,
      html,
    },
    { headers: { 'Cache-Control': 'no-store, must-revalidate' } }
  );
}

export function meta({ data }) {
  return [
    { title: `${data?.title || 'Post'} | Blog` },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
}

export default function BlogPost() {
  const { slug, title, date, abstract, html } = useLoaderData();

  return (
    <div className={styles.page}>
      <article className={styles.post}>
        <header className={styles.postHeader}>
          <RouterLink prefetch="intent" to="/blog" className={styles.back}>
            ← All posts
          </RouterLink>
          <h1 className={styles.postTitle}>{title}</h1>
          {date ? <time className={styles.date}>{formatDate(date)}</time> : null}
          {abstract ? <p className={styles.abstract}>{abstract}</p> : null}
        </header>

        <div className={styles.pdfWrap}>
          <object
            className={styles.pdf}
            data={`/blog/pdf/${slug}#view=FitH`}
            type="application/pdf"
            aria-label={`${title} (newspaper PDF)`}
          >
            <div className={styles.pdfFallback}>
              <p>Your browser can’t preview PDFs inline.</p>
              <a href={`/blog/pdf/${slug}`} download>
                ↓ Download the clipping
              </a>
            </div>
          </object>
          <a
            href={`/blog/pdf/${slug}`}
            className={styles.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the clipping in a new tab ↗
          </a>
        </div>

        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
      <Footer />
    </div>
  );
}
