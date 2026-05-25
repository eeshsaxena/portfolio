import sprTextureLarge from '~/assets/spr-lesson-builder-dark-large.jpg';
import sprTexturePlaceholder from '~/assets/spr-lesson-builder-dark-placeholder.jpg';
import sprTexture from '~/assets/spr-lesson-builder-dark.jpg';
import { Footer } from '~/components/footer';
import { MusicPlayer } from '~/components/music-player/music-player';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { ExperienceSection } from './experience-section';
import { SkillsSection } from './skills-section';
import { AchievementsSection } from './achievements-section';
import { useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import styles from './home.module.css';

// Prefetch draco decoader wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

export const meta = () => {
  return baseMeta({
    description: `Portfolio of ${config.name} — CS Engineering student at IIIT Senapati, Research Intern at IIIT Vadodara & IIT Tirupati. Specialist on Codeforces, Guardian on LeetCode. Building intelligent systems.`,
  });
};

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const experienceRef = useRef();
  const skillsRef = useRef();
  const achievementsRef = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, experienceRef, skillsRef, achievementsRef, details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <MusicPlayer />
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />

      {/* ── Top Works intro ── */}
      <div style={{
        width: '100%',
        maxWidth: 'var(--maxWidthL)',
        margin: '0 auto',
        padding: 'var(--space3XL) var(--spaceXL) var(--spaceL)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 'var(--spaceL)',
        flexWrap: 'wrap',
        borderBottom: '1px solid color-mix(in lab, var(--text) 10%, transparent)',
        marginBottom: 0,
      }}>
        <div>
          <span style={{
            fontFamily: 'var(--monoFontStack)',
            fontSize: '12px',
            color: 'var(--accent)',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '10px',
          }}>// Top Works</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 'var(--fontWeightMedium)',
            color: 'var(--textTitle)',
            margin: 0,
            lineHeight: 1.15,
          }}>Selected<br />Projects</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          <span style={{
            fontFamily: 'var(--monoFontStack)',
            fontSize: '11px',
            color: 'var(--textLight)',
            background: 'color-mix(in lab, var(--text) 6%, transparent)',
            border: '1px solid color-mix(in lab, var(--text) 12%, transparent)',
            borderRadius: '20px',
            padding: '4px 14px',
          }}>02 Projects featured</span>
          <p style={{
            fontFamily: 'var(--fontStack)',
            fontSize: 'var(--fontSizeBodyS)',
            color: 'var(--textBody)',
            margin: 0,
            maxWidth: '320px',
            textAlign: 'right',
            lineHeight: 1.6,
          }}>
            AI research at the intersection of NLP, Edge Computing, and Graph-based reasoning.
          </p>
          <a
            href="https://github.com/eeshsaxena"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--monoFontStack)',
              fontSize: '12px',
              color: 'var(--accent)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            View all on GitHub →
          </a>
        </div>
      </div>
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Conflict-Aware Graph RAG"
        description="Graph-based RAG pipeline converting text to knowledge triples via LLMs. Entropy-based conflict module reduces hallucination on multi-hop QA."
        buttonText="View on GitHub"
        buttonLink="https://github.com/eeshsaxena"
        model={{
          type: 'laptop',
          alt: 'Graph RAG knowledge graph visualization',
          textures: [
            {
              srcSet: `${sprTexture} 1280w, ${sprTextureLarge} 2560w`,
              placeholder: sprTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="RajNLP-50K Corpus"
        description="India's first open Rajasthani-Hindi code-switched corpus — 50K sentences. Fine-tuned MuRIL outperforms GPT-4o on NER, sentiment &amp; toxicity tasks."
        buttonText="View on HuggingFace"
        buttonLink="https://github.com/eeshsaxena"
        model={{
          type: 'laptop',
          alt: 'RajNLP NLP knowledge graph dashboard',
          textures: [
            {
              srcSet: `/static/rajnlp-laptop.png 1280w, /static/rajnlp-laptop.png 2560w`,
              placeholder: `/static/rajnlp-laptop.png`,
            },
          ],
        }}
      />
      <ExperienceSection
        id="experience"
        sectionRef={experienceRef}
        visible={visibleSections.includes(experienceRef.current)}
      />
      <SkillsSection
        id="skills"
        sectionRef={skillsRef}
        visible={visibleSections.includes(skillsRef.current)}
      />
      <AchievementsSection
        id="achievements"
        sectionRef={achievementsRef}
        visible={visibleSections.includes(achievementsRef.current)}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
