import config from '~/config.json';

// Eagerly import every article MDX so we can read its frontmatter
// (title/date) at build time. Article filenames follow the pattern
// `articles.<slug>.mdx`.
const articleModules = import.meta.glob('./articles.*.mdx', { eager: true });

const STATIC_ROUTES = [
  { path: '/', changefreq: 'monthly', priority: 1.0 },
  { path: '/projects', changefreq: 'monthly', priority: 0.9 },
  { path: '/experience', changefreq: 'monthly', priority: 0.8 },
  { path: '/stack', changefreq: 'monthly', priority: 0.7 },
  { path: '/articles', changefreq: 'weekly', priority: 0.9 },
  { path: '/contact', changefreq: 'monthly', priority: 0.8 },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildArticleEntries() {
  return Object.entries(articleModules).map(([file, mod]) => {
    // ./articles.<slug>.mdx → <slug>
    const slug = file.replace(/^\.\/articles\./, '').replace(/\.mdx$/, '');
    const frontmatter = mod?.frontmatter ?? {};
    return {
      path: `/articles/${slug}`,
      lastmod: frontmatter.date || null,
      changefreq: 'monthly',
      priority: 0.7,
    };
  });
}

function renderUrl({ path, lastmod, changefreq, priority }) {
  const loc = escapeXml(`${config.url}${path}`);
  const parts = [`    <loc>${loc}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority !== undefined) parts.push(`    <priority>${priority}</priority>`);
  return `  <url>\n${parts.join('\n')}\n  </url>`;
}

export function loader() {
  const entries = [...STATIC_ROUTES, ...buildArticleEntries()];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(renderUrl).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
