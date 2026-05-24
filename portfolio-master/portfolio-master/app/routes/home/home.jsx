import gamestackTexture2Large from '~/assets/gamestack-list-large.jpg';
import gamestackTexture2Placeholder from '~/assets/gamestack-list-placeholder.jpg';
import gamestackTexture2 from '~/assets/gamestack-list.jpg';
import gamestackTextureLarge from '~/assets/gamestack-login-large.jpg';
import gamestackTexturePlaceholder from '~/assets/gamestack-login-placeholder.jpg';
import gamestackTexture from '~/assets/gamestack-login.jpg';
import sliceTextureLarge from '~/assets/slice-app-large.jpg';
import sliceTexturePlaceholder from '~/assets/slice-app-placeholder.jpg';
import sliceTexture from '~/assets/slice-app.jpg';
import sprTextureLarge from '~/assets/spr-lesson-builder-dark-large.jpg';
import sprTexturePlaceholder from '~/assets/spr-lesson-builder-dark-placeholder.jpg';
import sprTexture from '~/assets/spr-lesson-builder-dark.jpg';
import { Footer } from '~/components/footer';
import { MusicPlayer } from '~/components/music-player/music-player';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
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
    title: 'Engineer + AI Researcher',
    description: `Portfolio of ${config.name} — CS Engineering student at IIIT Senapati, Research Intern at IIIT Vadodara & IIT Tirupati. Specialist on Codeforces, Guardian on LeetCode. Building intelligent systems.`,
  });
};

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const projectFour = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, projectFour, details];

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
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="RajNLP-50K Corpus"
        description="India's first open Rajasthani-Hindi code-switched corpus — 50K sentences. Fine-tuned MuRIL outperforms GPT-4o on NER, sentiment & toxicity tasks."
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
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="Cardiac Edge AI"
        description="5-class arrhythmia detector on Arduino Nano 33 BLE. 140× model compression via spectral knowledge distillation — ~99% F1 with ECG+PPG sensor fusion."
        buttonText="View on GitHub"
        buttonLink="https://github.com/eeshsaxena"
        model={{
          type: 'laptop',
          alt: 'Cardiac arrhythmia detection dashboard',
          textures: [
            {
              srcSet: `/static/cardiac-dashboard.png 1280w, /static/cardiac-dashboard.png 2560w`,
              placeholder: `/static/cardiac-dashboard.png`,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-4"
        alternate
        sectionRef={projectFour}
        visible={visibleSections.includes(projectFour.current)}
        index={4}
        title="Personal Portfolio Website"
        description="A cinematic dual-mode portfolio — choose between an immersive 3D computer-desk scene or a clean scrollable portfolio. Built with Three.js, WebGL, and vanilla JS."
        buttonText="View website"
        buttonLink="https://eeshsaxena.github.io"
        model={{
          type: 'laptop',
          alt: 'Portfolio website choose screen',
          textures: [
            {
              srcSet: `${sliceTexture} 800w, ${sliceTextureLarge} 1920w`,
              placeholder: sliceTexturePlaceholder,
            },
          ],
        }}
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
