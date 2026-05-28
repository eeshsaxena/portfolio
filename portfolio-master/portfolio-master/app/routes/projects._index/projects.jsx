import { Link as RouterLink, useLoaderData } from '@remix-run/react';
import { DecoderText } from '~/components/decoder-text';
import { Footer } from '~/components/footer';
import { cssProps } from '~/utils/style';
import styles from './projects.module.css';

export function Projects() {
  const { projects, githubUrl } = useLoaderData();
  const count = String(projects.length).padStart(2, '0');

  return (
    <div className={styles.projects}>
      <section className={styles.hero}>
        <div>
          <span className={styles.label}>// All Works</span>
          <h1 className={styles.title}>
            <DecoderText text="All Projects" delay={300} />
          </h1>
        </div>
        <div className={styles.meta}>
          <span className={styles.badge}>{count} Projects</span>
          <p className={styles.tagline}>
            AI research at the intersection of NLP, Edge Computing, and Graph-based reasoning.
          </p>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View on GitHub →
          </a>
        </div>
      </section>

      <div className={styles.grid}>
        {projects.map((project, index) => (
          <article
            key={project.title}
            className={styles.card}
            style={cssProps({ delay: index * 120 + 100 })}
          >
            <span className={styles.cardIndex}>
              {String(project.index).padStart(2, '0')}
            </span>
            <h2 className={styles.cardTitle}>{project.title}</h2>
            <p className={styles.cardDesc}>{project.description}</p>
            <ul className={styles.tags}>
              {project.tags.map(tag => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
            <div className={styles.cardLinks}>
              {project.article && (
                <RouterLink
                  prefetch="intent"
                  to={project.article}
                  className={styles.cardLink}
                >
                  Read more →
                </RouterLink>
              )}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardLinkSecondary}
              >
                GitHub ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      <Footer />
    </div>
  );
}
