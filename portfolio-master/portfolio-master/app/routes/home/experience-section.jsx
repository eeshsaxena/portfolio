import { useRef, useEffect } from 'react';
import { Link } from '@remix-run/react';
import styles from './experience-section.module.css';

const EXPERIENCES = [
  {
    role: 'Research Intern',
    org: 'IIIT Vadodara',
    period: 'Jan 2025 – Present',
    type: 'AI / NLP',
    description:
      'Built the RajNLP-50K code-switched Rajasthani-Hindi corpus. Fine-tuned MuRIL transformer — outperforms GPT-4o on NER, sentiment and toxicity tasks for low-resource Indic languages.',
    tags: ['NLP', 'PyTorch', 'HuggingFace', 'Python', 'Transformers'],
  },
  {
    role: 'Research Intern',
    org: 'IIT Tirupati',
    period: 'Jul 2024 – Dec 2024',
    type: 'Edge AI / ML',
    description:
      'Designed a 5-class arrhythmia detector on Arduino Nano 33 BLE with ECG+PPG sensor fusion. Applied spectral knowledge distillation for 140× model compression achieving ~99% F1.',
    tags: ['TFLite', 'Edge AI', 'ECG', 'OpenCV', 'Python'],
  },
];

export const ExperienceSection = ({ id, sectionRef, visible }) => {
  return (
    <section className={styles.section} id={id} ref={sectionRef}>
      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>
        <div className={styles.header}>
          <span className={styles.label}>// Experience</span>
          <h2 className={styles.title}>Research & Work</h2>
        </div>

        <div className={styles.timeline}>
          {EXPERIENCES.map((exp, i) => (
            <div
              key={i}
              className={styles.card}
              style={{ '--delay': `${i * 120}ms` }}
            >
              <div className={styles.cardAccent} />
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.role}>{exp.role}</h3>
                    <p className={styles.org}>
                      {exp.org}
                      <span className={styles.period}> · {exp.period}</span>
                    </p>
                  </div>
                  <span className={styles.badge}>{exp.type}</span>
                </div>
                <p className={styles.description}>{exp.description}</p>
                <div className={styles.tags}>
                  {exp.tags.map(t => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Link to="/details" className={styles.seeMore}>
            View full experience & stack →
          </Link>
        </div>
      </div>
    </section>
  );
};
