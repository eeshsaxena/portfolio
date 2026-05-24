import profileImgLarge from '~/assets/profile-large.jpg';
import profileImgPlaceholder from '~/assets/profile-placeholder.jpg';
import profileImg from '~/assets/profile.jpg';
import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { Fragment, useState } from 'react';
import { media } from '~/utils/style';
import katakana from './katakana.svg';
import styles from './profile.module.css';

const ProfileText = ({ visible, titleId }) => (
  <Fragment>
    <Heading className={styles.title} data-visible={visible} level={3} id={titleId}>
      <DecoderText text="About me" start={visible} delay={500} />
    </Heading>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      Growing up, I had two very different dreams — studying an MBA to build businesses, and
      diving deep into technology. Then in 7th standard, I opened a text editor for the first
      time and wrote my first HTML and CSS page. Seeing a webpage come to life from a few
      lines of code was enough to change everything.
    </Text>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      Since that day I never stopped building. From simple static sites to full-stack apps,
      from competitive programming marathons to ML research — every project has been a step
      forward. Today I'm a CS Engineering student at{' '}
      <Link href="https://iiitmanipur.ac.in">IIIT Senapati</Link>, a Research Intern at{' '}
      <Link href="https://iiitvadodara.ac.in">IIIT Vadodara</Link> working on encrypted
      image steganography, and I previously interned at{' '}
      <Link href="https://iittp.ac.in">IIT Tirupati's SEVA Lab</Link> on transformer-based
      multi-object tracking.
    </Text>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      Outside the lab I'm a competitive programmer — Specialist on Codeforces (1582),
      Guardian on LeetCode (1873), 4★ on CodeChef. The MBA dream never fully left either;
      I still think about the intersection of technology and business every day. Feel free
      to <Link href="/contact">reach out</Link> — always open to collaborations, research,
      or a good conversation about what we're building next.
    </Text>
  </Fragment>
);


export const Profile = ({ id, visible, sectionRef }) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {({ visible, nodeRef }) => (
          <div className={styles.content} ref={nodeRef}>
            <div className={styles.column}>
              <ProfileText visible={visible} titleId={titleId} />
              <Button
                secondary
                className={styles.button}
                data-visible={visible}
                href="/contact"
                icon="send"
              >
                Send me a message
              </Button>
            </div>
            <div className={styles.column}>
              <div className={styles.tag} aria-hidden>
                <Divider
                  notchWidth="64px"
                  notchHeight="8px"
                  collapsed={!visible}
                  collapseDelay={1000}
                />
                <div className={styles.tagText} data-visible={visible}>
                  About me
                </div>
              </div>
              <div className={styles.image}>
                <svg
                  className={styles.svg}
                  data-visible={visible}
                  viewBox="0 0 136 766"
                >
                  <use href={`${katakana}#katakana-profile`} />
                </svg>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
