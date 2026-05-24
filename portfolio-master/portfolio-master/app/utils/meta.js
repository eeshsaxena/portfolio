import config from '~/config.json';

const { name, url, twitter, keywords } = config;
const defaultOgImage = `${url}/social-image.png`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Eesh Saxena',
  url: 'https://eeshsaxena.com',
  email: 'eeshsaxena@gmail.com',
  jobTitle: 'AI Researcher & Software Engineer',
  description:
    'CS Engineering student at IIIT Senapati, Manipur. Research Intern at IIIT Vadodara and IIT Tirupati. Specializing in AI/ML, NLP, and Full-Stack Development.',
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'IIIT Senapati, Manipur',
  },
  sameAs: [
    'https://github.com/eeshsaxena',
    'https://linkedin.com/in/eeshsaxena',
  ],
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
}) {
  const titleText = [prefix, title].filter(Boolean).join(' — ');

  return [
    { title: titleText },
    { name: 'description', content: description },
    { name: 'author', content: name },
    { name: 'keywords', content: keywords },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: 'English' },
    { name: 'revisit-after', content: '7 days' },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:alt', content: `${name} — Portfolio` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '800' },
    { property: 'og:title', content: titleText },
    { property: 'og:site_name', content: name },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:description', content: description },
    { property: 'og:locale', content: 'en_US' },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:description', content: description },
    { property: 'twitter:title', content: titleText },
    { property: 'twitter:site', content: twitter },
    { property: 'twitter:creator', content: twitter },
    { property: 'twitter:image', content: ogImage },
    { 'script:ld+json': jsonLd },
  ];
}
