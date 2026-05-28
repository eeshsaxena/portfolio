import { Link as RouterLink } from '@remix-run/react';
import { DecoderText } from '~/components/decoder-text';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { cssProps } from '~/utils/style';
import { EXPERIENCES } from '../home/experience-section';
import styles from './experience.module.css';

const EDUCATION = [
  {
    degree: 'B.Tech, Computer Science Engineering',
    org: 'IIIT Senapati, Manipur',
    note: 'Specialist on Codeforces · Guardian on LeetCode.',
  },
];

const CORE_STACK = [
  'C++',
  'Python',
  'PyTorch',
  'HuggingFace',
  'LangChain',
  'React.js',
  'Neo4j',
  'OpenCV',
];

export function meta({ matches }) {
  const canonicalUrl = matches.find(m => m.id === 'root')?.data?.canonicalUrl;
  return baseMeta({
    title: 'Experience',
    description:
      'Full research and work experience of Eesh Saxena — internships at IIIT Vadodara and IIT Tirupati, plus the core technical stack.',
    canonicalUrl,
  });
}

export default function Experience() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.label}>// Experience</span>
          <h1 className={styles.title}>
            <DecoderText text="Experience & Stack" delay={300} />
          </h1>
        </div>
        <div className={styles.meta}>
          <p className={styles.tagline}>
            Research internships, work, and the stack behind them.
          </p>
          <RouterLink prefetch="intent" to="/projects" className={styles.link}>
            View projects →
          </RouterLink>
        </div>
      </section>

      <div className={styles.body}>
        <h2 className={styles.sectionHeading}>Research &amp; Work</h2>
        <div className={styles.timeline}>
          {EXPERIENCES.map((exp, i) => (
            <article
              key={i}
              className={styles.card}
              style={cssProps({ delay: i * 100 + 100 })}
            >
              <div className={styles.cardTop}>
                <div>
                  <h3 className={styles.role}>{exp.role}</h3>
                  <p className={styles.org}>
                    {exp.org}
                    <span className={styles.period}> · {exp.period}</span>
                  </p>
                  {exp.supervisor && (
                    <p className={styles.supervisor}>{exp.supervisor}</p>
                  )}
                </div>
                <span className={styles.badge}>{exp.type}</span>
              </div>
              <p className={styles.description}>{exp.description}</p>
              <div className={styles.tags}>
                {exp.tags.map(t => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <h2 className={styles.sectionHeading}>Education</h2>
        <div className={styles.timeline}>
          {EDUCATION.map((ed, i) => (
            <article key={i} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <h3 className={styles.role}>{ed.degree}</h3>
                  <p className={styles.org}>{ed.org}</p>
                </div>
              </div>
              <p className={styles.description}>{ed.note}</p>
            </article>
          ))}
        </div>

        <h2 className={styles.sectionHeading}>Core Stack</h2>
        <div className={styles.stackStrip}>
          {CORE_STACK.map(s => (
            <span key={s} className={styles.stackTag}>
              {s}
            </span>
          ))}
        </div>
        <RouterLink prefetch="intent" to="/stack" className={styles.stackLink}>
          View full stack &amp; tools →
        </RouterLink>
      </div>

      <Footer />
    </div>
  );
}
