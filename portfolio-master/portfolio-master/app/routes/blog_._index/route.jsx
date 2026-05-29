import { json, redirect } from '@remix-run/cloudflare';
import { Link as RouterLink, useLoaderData } from '@remix-run/react';
import { DecoderText } from '~/components/decoder-text';
import { Footer } from '~/components/footer';
import { formatDate } from '~/utils/date';
import { isUnlocked } from '~/utils/extra-session.server';
import styles from '../blog/blog.module.css';

export async function loader({ request, context }) {
  // Private: only readable once unlocked via the Extra password.
  if (!(await isUnlocked(request, context))) {
    throw redirect('/extracurricular');
  }
  const modules = import.meta.glob('../blog.*.mdx', { eager: true });
  const build = await import('virtual:remix/server-build');

  const posts = Object.entries(modules)
    .map(([file, mod]) => {
      const id = file.replace('../', 'routes/').replace(/\.mdx$/, '');
      const slug = build.routes[id]?.path;
      return { slug, frontmatter: mod.frontmatter };
    })
    .filter(p => p.slug)
    .sort((a, b) =>
      (a.frontmatter.date || '') < (b.frontmatter.date || '') ? 1 : -1
    );

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
          <p className={styles.empty}>No posts yet.</p>
        ) : (
          posts.map(({ slug, frontmatter }) => (
            <RouterLink
              key={slug}
              prefetch="intent"
              to={`/blog/${slug}`}
              className={styles.item}
            >
              {frontmatter.date ? (
                <time className={styles.itemDate}>
                  {formatDate(frontmatter.date)}
                </time>
              ) : null}
              <h2 className={styles.itemTitle}>{frontmatter.title}</h2>
              {frontmatter.abstract ? (
                <p className={styles.itemAbstract}>{frontmatter.abstract}</p>
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
