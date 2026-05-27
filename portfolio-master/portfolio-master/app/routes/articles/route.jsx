import { json } from '@remix-run/cloudflare';
import { Outlet, useLoaderData } from '@remix-run/react';
import { MDXProvider } from '@mdx-js/react';
import { Post, postMarkdown } from '~/layouts/post';
import { articleJsonLd, baseMeta } from '~/utils/meta';
import config from '~/config.json';
import { formatTimecode, readingTime } from '~/utils/timecode';

export async function loader({ request }) {
  const slug = request.url.split('/').at(-1);
  const module = await import(`../articles.${slug}.mdx`);
  const text = await import(`../articles.${slug}.mdx?raw`);
  const readTime = readingTime(text.default);
  const ogImage = `${config.url}/static/${slug}-og.jpg`;
  const articleUrl = `${config.url}/articles/${slug}`;

  return json({
    ogImage,
    articleUrl,
    frontmatter: module.frontmatter,
    timecode: formatTimecode(readTime),
  });
}

export function meta({ data, matches }) {
  const { title, abstract, date } = data.frontmatter;
  const rootData = matches.find(m => m.id === 'root')?.data;
  const canonicalUrl = rootData?.canonicalUrl || data.articleUrl;

  return baseMeta({
    title,
    description: abstract,
    prefix: '',
    ogImage: data.ogImage,
    canonicalUrl,
    type: 'article',
    jsonLd: articleJsonLd({
      title,
      description: abstract,
      date,
      url: data.articleUrl,
      image: data.ogImage,
    }),
  });
}

export default function Articles() {
  const { frontmatter, timecode } = useLoaderData();

  return (
    <MDXProvider components={postMarkdown}>
      <Post {...frontmatter} timecode={timecode}>
        <Outlet />
      </Post>
    </MDXProvider>
  );
}
