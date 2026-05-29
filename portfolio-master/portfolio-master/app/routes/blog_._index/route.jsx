import { json, redirect } from '@remix-run/cloudflare';
import { Link as RouterLink, useLoaderData } from '@remix-run/react';
import { DecoderText } from '~/components/decoder-text';
import { Footer } from '~/components/footer';
import { isUnlocked } from '~/utils/extra-session.server';
import { formatDate } from '~/utils/date';
import styles from '../blog/blog.module.css';

export async function loader({ request, context }) {
  if (!(await isUnlocked(request, context))) {
    throw redirect('/extracurricular');
  }
  const kv = context.cloudflare.env.BLOG_KV;
  const list = kv ? await kv.list({ prefix: 'post:' }) : { keys: [] };
  const posts = list.keys
    .map(k => ({ slug: k.name.replace(/^post:/, ''), ...(k.metadata || {}) }))
    .sort((a, b) => ((a.date || '') < (b.date || '') ? 1 : -1));

  return json(
    { posts },
    { headers: { 'Cache-Control': 'no-store, must-revalidate' } }
  );
}

export function meta() {
  return [
    { title: 'Eesh Saxena | Blog' },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
}

export default function BlogIndex() {
  const { posts } = useLoaderData();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.label}>// Writing</span>
        <h1 className={styles.heroTitle}>
          <DecoderText text="Blog" delay={300} />
        </h1>
        <p className={styles.heroTagline}>
          Newspaper articles I’ve written, with the original clipping and a few
          notes on each.
        </p>
      </section>

      <div className={styles.list}>
        {posts.length === 0 ? (
          <p className={styles.empty}>
            No posts yet — add one from the <a href="/admin">writer</a>.
          </p>
        ) : (
          posts.map(p => (
            <RouterLink
              key={p.slug}
              prefetch="intent"
              to={`/blog/${p.slug}`}
              className={styles.item}
            >
              {p.date ? (
                <time className={styles.itemDate}>{formatDate(p.date)}</time>
              ) : null}
              <h2 className={styles.itemTitle}>{p.title || p.slug}</h2>
              {p.abstract ? (
                <p className={styles.itemAbstract}>{p.abstract}</p>
              ) : null}
              <span className={styles.itemLink}>Read →</span>
            </RouterLink>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}
