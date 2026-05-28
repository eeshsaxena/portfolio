import { Link as RouterLink } from '@remix-run/react';
import { DecoderText } from '~/components/decoder-text';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { cssProps } from '~/utils/style';
import { SKILLS, CATEGORY_COLORS } from '../home/skills-section';
import styles from './stack.module.css';

const SETUP = [
  {
    label: 'Editor',
    value: 'VS Code',
    note: 'Main editor, configured with ESLint + Prettier for consistent formatting.',
  },
  {
    label: 'OS / Shell',
    value: 'Linux',
    note: 'Primary day-to-day development environment.',
  },
  {
    label: 'Version Control',
    value: 'Git + GitHub',
    note: 'Feature branches and pull-request reviews.',
  },
  {
    label: 'AI / ML',
    value: 'PyTorch · HuggingFace · Ollama',
    note: 'Training in PyTorch; Transformers and local models served via Ollama.',
  },
  {
    label: 'Data',
    value: 'MySQL · MongoDB · Neo4j',
    note: 'Relational, document, and graph stores depending on the problem.',
  },
  {
    label: 'Deploy',
    value: 'Cloudflare · Vercel',
    note: 'Edge-first hosting on Cloudflare Pages and Vercel.',
  },
];

export function meta({ matches }) {
  const canonicalUrl = matches.find(m => m.id === 'root')?.data?.canonicalUrl;
  return baseMeta({
    title: 'Stack & Tools',
    description:
      'The full technology stack, tools, and setup Eesh Saxena uses to build software and run ML research.',
    canonicalUrl,
  });
}

export default function Stack() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.label}>// Full Stack</span>
          <h1 className={styles.title}>
            <DecoderText text="Stack & Tools" delay={300} />
          </h1>
        </div>
        <div className={styles.meta}>
          <p className={styles.tagline}>
            Languages, frameworks, and the tools I reach for day to day.
          </p>
          <RouterLink prefetch="intent" to="/experience" className={styles.link}>
            View experience →
          </RouterLink>
        </div>
      </section>

      <div className={styles.body}>
        <h2 className={styles.sectionHeading}>Technologies</h2>
        <div className={styles.categories}>
          {Object.entries(SKILLS).map(([category, items], i) => (
            <div
              key={category}
              className={styles.category}
              style={cssProps({ delay: i * 80 + 100 })}
            >
              <span
                className={styles.categoryLabel}
                style={{ '--cat-color': CATEGORY_COLORS[category] }}
              >
                {category}
              </span>
              <div className={styles.tags}>
                {items.map(skill => (
                  <span
                    key={skill}
                    className={styles.tag}
                    style={{ '--cat-color': CATEGORY_COLORS[category] }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className={styles.sectionHeading}>Setup &amp; Workflow</h2>
        <div className={styles.setupGrid}>
          {SETUP.map((item, i) => (
            <div
              key={item.label}
              className={styles.setupCard}
              style={cssProps({ delay: i * 80 + 100 })}
            >
              <span className={styles.setupLabel}>{item.label}</span>
              <span className={styles.setupValue}>{item.value}</span>
              <p className={styles.setupNote}>{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
