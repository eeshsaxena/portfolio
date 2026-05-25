import { Link } from '@remix-run/react';
import styles from './achievements-section.module.css';

// ── Real ratings from resume ──────────────────────────────────
const CP_PROFILES = [
  {
    platform: 'Codeforces',
    handle: 'eeshsaxena',
    rank: 'Specialist',
    rating: 1582,
    color: '#5b8dd9',
    icon: 'CF',
    url: 'https://codeforces.com/profile/eeshsaxena',
    badge: '● Specialist',
    extra: 'Top 1% in India',
  },
  {
    platform: 'LeetCode',
    handle: 'eeshsaxena',
    rank: 'Guardian',
    rating: 1873,
    color: '#ffa116',
    icon: 'LC',
    url: 'https://leetcode.com/eeshsaxena',
    badge: '◆ Guardian',
    extra: 'Top 5% World',
  },
  {
    platform: 'CodeChef',
    handle: 'eeshsaxena',
    rank: '4★ Coder',
    rating: 1866,
    color: '#c97b3a',
    icon: 'CC',
    url: 'https://www.codechef.com/users/eeshsaxena',
    badge: '★★★★ 4 Star',
    extra: 'Top 1% in India',
  },
];

const EXTRAS = [
  { label: 'Problems solved (total)', value: '1500+', icon: '✅' },
  { label: 'Contests participated', value: '50+', icon: '🏁' },
  { label: 'Best — CodeChef Starters 180', value: 'Global #1', icon: '🥇' },
];
// ─────────────────────────────────────────────────────────────

export const AchievementsSection = ({ id, sectionRef, visible }) => {
  return (
    <section className={styles.section} id={id} ref={sectionRef}>
      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.label}>// Achievements</span>
          <h2 className={styles.title}>Competitive<br />Programming</h2>
        </div>

        {/* CP Profile Cards */}
        <div className={styles.cards}>
          {CP_PROFILES.map((p, i) => (
            <a
              key={p.platform}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              style={{ '--delay': `${i * 100}ms`, '--card-color': p.color }}
            >
              {/* Glow bar */}
              <div className={styles.cardGlow} />

              {/* Top row */}
              <div className={styles.cardTop}>
                <span className={styles.platformIcon}>{p.icon}</span>
                <span className={styles.platformName}>{p.platform}</span>
                <span className={styles.rankBadge} style={{ color: p.color, borderColor: p.color }}>
                  {p.badge}
                </span>
              </div>

              {/* Rating */}
              <div className={styles.ratingRow}>
                <span className={styles.ratingNum} style={{ color: p.color }}>
                  {p.rating}
                </span>
                <span className={styles.ratingLabel}>Rating</span>
              </div>

              {/* Handle + stats */}
              <div className={styles.cardBottom}>
                <span className={styles.handle}>@{p.handle}</span>
                <span className={styles.problems}>{p.extra}</span>
              </div>

              {/* Arrow */}
              <span className={styles.arrow}>↗</span>
            </a>
          ))}
        </div>

        {/* Extra stats strip */}
        <div className={styles.extras}>
          {EXTRAS.map(e => (
            <div key={e.label} className={styles.extraItem}>
              <span className={styles.extraIcon}>{e.icon}</span>
              <span className={styles.extraValue}>{e.value}</span>
              <span className={styles.extraLabel}>{e.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <a
            href="https://codeforces.com/profile/eeshsaxena"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.seeMore}
          >
            View Codeforces profile →
          </a>
        </div>
      </div>
    </section>
  );
};
