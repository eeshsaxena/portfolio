import { Link } from '@remix-run/react';
import styles from './skills-section.module.css';

const SKILLS = {
  Languages:  ['C++', 'Python', 'JavaScript', 'SQL'],
  Frameworks: ['React.js', 'Node.js', 'Express.js', 'PyTorch', 'NumPy', 'OpenCV', 'TFLite'],
  'AI / ML':  ['LangChain', 'HuggingFace', 'Ollama', 'Transformers', 'MuRIL'],
  Databases:  ['MySQL', 'MongoDB', 'Neo4j', 'Firebase', 'Supabase'],
  Tools:      ['Git', 'Linux', 'VS Code', 'Vercel', 'Cloudflare'],
};

const CATEGORY_COLORS = {
  Languages:  'var(--accent)',
  Frameworks: '#7c6fcd',
  'AI / ML':  '#e44d7b',
  Databases:  '#4db8e8',
  Tools:      '#50c878',
};

export const SkillsSection = ({ id, sectionRef, visible }) => {
  return (
    <section className={styles.section} id={id} ref={sectionRef}>
      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>
        <div className={styles.header}>
          <span className={styles.label}>// Stack</span>
          <h2 className={styles.title}>Skills & Technologies</h2>
        </div>

        <div className={styles.categories}>
          {Object.entries(SKILLS).map(([category, items]) => (
            <div key={category} className={styles.category}>
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

        <div className={styles.footer}>
          <Link to="/details" className={styles.seeMore}>
            View full stack & tools setup →
          </Link>
        </div>
      </div>
    </section>
  );
};
