import { useRef, useEffect } from 'react';
import { Link } from '@remix-run/react';
import styles from './experience-section.module.css';

export const EXPERIENCES = [
  {
    role: 'Research Intern',
    org: 'IIIT Vadodara',
    supervisor: 'Under Dr. Abhisek Paul',
    period: '2026 (6 months)',
    type: 'Image Security / RDH',
    description:
      'Analysed Zhang (IEEE SPL 2011) on Reversible Data Hiding in Encrypted Images. Studied 30+ related works, implemented the encryption–embedding–extraction pipeline in Python, and achieved 100% reconstruction fidelity with a 0.5 bpp embedding rate.',
    tags: ['Python', 'Image Encryption', 'RDH', 'PSNR', 'IEEE'],
  },
  {
    role: 'Winter Research Intern',
    org: 'IIT Tirupati — SEVA Lab',
    supervisor: 'Under Dr. Chalavadi Vishnu',
    period: '2025 (Winter)',
    type: 'Computer Vision / MOT',
    description:
      'Reproduced MOTIP (CVPR 2025) for Multiple Object Tracking. Evaluated transformer-based identity prediction, achieving 68.2 MOTA and 64.5 HOTA on MOT17 datasets by optimizing query initialization and spatio-temporal embeddings for dense scenes.',
    tags: ['CVPR 2025', 'MOT', 'Transformers', 'MOTA', 'IDF1', 'HOTA'],
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
                    {exp.supervisor && (
                      <p className={styles.supervisor}>{exp.supervisor}</p>
                    )}
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
          <Link prefetch="intent" to="/experience" className={styles.seeMore}>
            View full experience & stack →
          </Link>
        </div>
      </div>
    </section>
  );
};
