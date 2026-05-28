import sprTextureLarge from '~/assets/spr-lesson-builder-dark-large.jpg';
import sprTexturePlaceholder from '~/assets/spr-lesson-builder-dark-placeholder.jpg';
import sprTexture from '~/assets/spr-lesson-builder-dark.jpg';
import { Footer } from '~/components/footer';
import { MusicPlayer } from '~/components/music-player/music-player';
import { baseMeta, profilePageJsonLd } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { ExperienceSection } from './experience-section';
import { SkillsSection } from './skills-section';
import { AchievementsSection } from './achievements-section';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@remix-run/react';
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

export const meta = ({ matches }) => {
  const canonicalUrl = matches.find(m => m.id === 'root')?.data?.canonicalUrl;
  return baseMeta({
    description: `I'm ${config.name}, a CS Engineering student at IIIT Senapati and a research intern at IIIT Vadodara and IIT Tirupati. I build things with AI/ML and NLP, and compete on Codeforces (Specialist) and LeetCode (Guardian).`,
    canonicalUrl,
    jsonLd: profilePageJsonLd,
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

      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />

      <div className={styles.topWorks}>
        <div>
          <span className={styles.topWorksLabel}>// Top Works</span>
          <h2 className={styles.topWorksTitle}>
            Selected<br />Projects
          </h2>
        </div>
        <div className={styles.topWorksMeta}>
          <span className={styles.topWorksBadge}>02 Projects featured</span>
          <p className={styles.topWorksTagline}>
            Work across NLP, edge computing, and graph-based reasoning.
          </p>
          <Link
            unstable_viewTransition
            prefetch="intent"
            to="/projects"
            className={styles.topWorksLink}
          >
            View all projects →
          </Link>
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
        description="India's first open Rajasthani-Hindi code-switched corpus of 50K sentences. Fine-tuned MuRIL beats GPT-4o on NER, sentiment, and toxicity tasks."
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
      <div className={styles.moreWorks}>
        <Link
          unstable_viewTransition
          prefetch="intent"
          to="/projects"
          className={styles.moreWorksLink}
        >
          Show more works →
        </Link>
      </div>
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
      <Footer />
    </div>
  );
};
