import config from '~/config.json';

const { name, url, twitter, keywords, github, linkedin } = config;
const defaultOgImage = `${url}/social-image.png`;

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name,
  url,
  email: 'eeshsaxena@gmail.com',
  jobTitle: 'AI Researcher & Software Engineer',
  description:
    'CS Engineering student at IIIT Senapati, Manipur. Research Intern at IIIT Vadodara and IIT Tirupati. Specializing in AI/ML, NLP, and Full-Stack Development.',
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'IIIT Senapati, Manipur',
  },
  sameAs: [
    github && `https://github.com/${github}`,
    linkedin && `https://linkedin.com/in/${linkedin}`,
  ].filter(Boolean),
  knowsAbout: [
    'Machine Learning', 'NLP', 'Deep Learning', 'React', 'Node.js',
    'Python', 'C++', 'PyTorch', 'LangChain', 'Graph RAG',
  ],
};

export function baseMeta({
  title,
  description,
  prefix = name,
  ogImage = defaultOgImage,
  canonicalUrl,
  type = 'website',
  jsonLd,
}) {
  const titleText = [prefix, title].filter(Boolean).join(' — ');
  const pageUrl = canonicalUrl || url;

  return [
    { title: titleText },
    { name: 'description', content: description },
    { name: 'author', content: name },
    { name: 'keywords', content: keywords },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: 'English' },
    { name: 'revisit-after', content: '7 days' },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:alt', content: `${name} — Portfolio` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '800' },
    { property: 'og:title', content: titleText },
    { property: 'og:site_name', content: name },
    { property: 'og:type', content: type },
    { property: 'og:url', content: pageUrl },
    { property: 'og:description', content: description },
    { property: 'og:locale', content: 'en_US' },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:description', content: description },
    { property: 'twitter:title', content: titleText },
    { property: 'twitter:site', content: twitter },
    { property: 'twitter:creator', content: twitter },
    { property: 'twitter:image', content: ogImage },
    { 'script:ld+json': jsonLd || personJsonLd },
  ];
}

/**
 * Build a BlogPosting JSON-LD object for an article page.
 */
export function articleJsonLd({ title, description, date, url: articleUrl, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Person',
      name,
      url,
    },
    publisher: {
      '@type': 'Person',
      name,
      url,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    image,
    url: articleUrl,
  };
}

/**
 * WebSite schema — helps Google generate sitelinks and provides a
 * search action target. Placed at the root so it appears on every page.
 */
export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name,
  url,
  inLanguage: 'en',
  author: { '@type': 'Person', name, url },
};

/**
 * ProfilePage schema for the homepage — signals to Google that this
 * is the canonical profile page for the person, separate from
 * blog/portfolio pages.
 */
export const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: personJsonLd,
};
