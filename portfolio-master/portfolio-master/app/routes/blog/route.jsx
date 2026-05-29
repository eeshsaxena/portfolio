import { json, redirect } from '@remix-run/cloudflare';
import { Outlet, useLoaderData, Link as RouterLink } from '@remix-run/react';
import { MDXProvider } from '@mdx-js/react';
import { Footer } from '~/components/footer';
import { formatDate } from '~/utils/date';
import { isUnlocked } from '~/utils/extra-session.server';
import styles from './blog.module.css';

export async function loader({ request, context }) {
  // Private: only readable once unlocked via the Extra password.
  if (!(await isUnlocked(request, context))) {
    throw redirect('/extracurricular');
  }
  const slug = new URL(request.url).pathname.split('/').filter(Boolean).at(-1);
  const module = await import(`../blog.${slug}.mdx`);
  return json(
    { frontmatter: module.frontmatter },
    { headers: { 'Cache-Control': 'no-store, must-revalidate' } }
  );
}

export function meta({ data }) {
  const title = data?.frontmatter?.title || 'Blog';
  return [
    { title: `${title} | Blog` },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
}

export default function BlogPost() {
  const { frontmatter } = useLoaderData();
  const { title, date, pdf, abstract } = frontmatter;

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

        {pdf ? (
          <div className={styles.pdfWrap}>
            <object
              className={styles.pdf}
              data={`${pdf}#view=FitH`}
              type="application/pdf"
              aria-label={`${title} (newspaper PDF)`}
            >
              <div className={styles.pdfFallback}>
                <p>Your browser can’t preview PDFs inline.</p>
                <a href={pdf} download>
                  ↓ Download the clipping
                </a>
              </div>
            </object>
            <a
              href={pdf}
              className={styles.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the clipping in a new tab ↗
            </a>
          </div>
        ) : null}

        <div className={styles.body}>
          <MDXProvider>
            <Outlet />
          </MDXProvider>
        </div>
      </article>
      <Footer />
    </div>
  );
}
