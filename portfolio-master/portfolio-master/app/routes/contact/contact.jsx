import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Icon } from '~/components/icon';
import { Input } from '~/components/input';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { useFormInput } from '~/hooks';
import { useRef, useState } from 'react';
import { cssProps, msToNum, numToMs } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import styles from './contact.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Contact',
    description:
      "Send me a message if you're interested in discussing a project or if you just want to say hi",
  });
};

// No-op action — form is handled client-side via Web3Forms
export async function action() {
  return null;
}

const MAX_EMAIL_LENGTH = 512;
const MAX_MESSAGE_LENGTH = 4096;
const EMAIL_PATTERN = /(.+)@(.+){2,}\.(.+){2,}/;

const contactInfo = [
  { emoji: '✉️', label: 'Email', value: 'eeshsaxena@gmail.com', href: 'mailto:eeshsaxena@gmail.com' },
  { emoji: '📱', label: 'Phone', value: '+91 7976212108', href: 'tel:+917976212108' },
  { emoji: '💼', label: 'LinkedIn', value: 'linkedin.com/in/eeshsaxena', href: 'https://linkedin.com/in/eeshsaxena' },
  { emoji: '🐙', label: 'GitHub', value: 'github.com/eeshsaxena', href: 'https://github.com/eeshsaxena' },
  { emoji: '📍', label: 'Location', value: 'Gandhinagar, Gujarat, India', href: null },
];

export const Contact = () => {
  const errorRef = useRef();
  const email = useFormInput('');
  const message = useFormInput('');
  const initDelay = tokens.base.durationS;
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};

    if (!email.value || !EMAIL_PATTERN.test(email.value)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!message.value) {
      newErrors.message = 'Please enter a message.';
    }
    if (email.value.length > MAX_EMAIL_LENGTH) {
      newErrors.email = `Email must be shorter than ${MAX_EMAIL_LENGTH} characters.`;
    }
    if (message.value.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message must be shorter than ${MAX_MESSAGE_LENGTH} characters.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSending(true);
    setErrors({});

    try {
      // Web3Forms — free email service (250/month, no backend needed)
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '7ecdf435-8b50-4208-8004-6846b623f457',
          from_name: 'Portfolio Contact',
          subject: `Portfolio message from ${email.value}`,
          email: email.value,
          message: message.value,
          botcheck: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        // Fallback: open mailto
        const subj = encodeURIComponent(`Portfolio message from ${email.value}`);
        const body = encodeURIComponent(`From: ${email.value}\n\n${message.value}`);
        window.open(`mailto:eeshsaxena@gmail.com?subject=${subj}&body=${body}`);
        setSuccess(true);
      }
    } catch {
      // Offline fallback
      const subj = encodeURIComponent(`Portfolio message from ${email.value}`);
      const body = encodeURIComponent(`From: ${email.value}\n\n${message.value}`);
      window.open(`mailto:eeshsaxena@gmail.com?subject=${subj}&body=${body}`);
      setSuccess(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <Section className={styles.contact}>
      <Transition unmount in={!success} timeout={1600}>
        {({ status, nodeRef }) => (
          <div className={styles.wrapper} ref={nodeRef} data-status={status}>
            {/* Left panel — contact info */}
            <aside className={styles.infoPanel}>
              <Heading
                className={styles.infoTitle}
                level={4}
                as="h2"
                data-status={status}
                style={getDelay(tokens.base.durationXS, initDelay, 0.2)}
              >
                Get in touch
              </Heading>
              <Text
                className={styles.infoSubtitle}
                size="s"
                data-status={status}
                style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
              >
                Open to internships, research collaborations &amp; freelance projects.
              </Text>
              <div className={styles.infoCards}>
                {contactInfo.map(({ emoji, label, value, href }, i) => (
                  <div
                    key={label}
                    className={styles.infoCard}
                    data-status={status}
                    style={getDelay(tokens.base.durationXS, initDelay, 0.4 + i * 0.08)}
                  >
                    <span className={styles.infoEmoji} aria-hidden="true">{emoji}</span>
                    <div className={styles.infoCardContent}>
                      <span className={styles.infoCardLabel}>{label}</span>
                      {href ? (
                        <a
                          className={styles.infoCardValue}
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className={styles.infoCardValue}>{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Right panel — form */}
            <form className={styles.form} onSubmit={handleSubmit}>
              <Heading
                className={styles.title}
                data-status={status}
                level={3}
                as="h1"
                style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
              >
                <DecoderText text="Say hello" start={status !== 'exited'} delay={300} />
              </Heading>
              <Divider
                className={styles.divider}
                data-status={status}
                style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
              />
              <Input
                required
                className={styles.input}
                data-status={status}
                style={getDelay(tokens.base.durationXS, initDelay)}
                autoComplete="email"
                label="Your email"
                type="email"
                name="email"
                maxLength={MAX_EMAIL_LENGTH}
                {...email}
              />
              <Input
                required
                multiline
                className={styles.input}
                data-status={status}
                style={getDelay(tokens.base.durationS, initDelay)}
                autoComplete="off"
                label="Message"
                name="message"
                maxLength={MAX_MESSAGE_LENGTH}
                {...message}
              />
              {Object.keys(errors).length > 0 && (
                <div className={styles.formError} ref={errorRef}>
                  <div className={styles.formErrorContent}>
                    <div className={styles.formErrorMessage}>
                      <Icon className={styles.formErrorIcon} icon="error" />
                      {errors.email || errors.message}
                    </div>
                  </div>
                </div>
              )}
              <Button
                className={styles.button}
                data-status={status}
                data-sending={sending}
                style={getDelay(tokens.base.durationM, initDelay)}
                disabled={sending}
                loading={sending}
                loadingText="Sending..."
                icon="send"
                type="submit"
              >
                Send message
              </Button>
            </form>
          </div>
        )}
      </Transition>

      <Transition unmount in={success}>
        {({ status, nodeRef }) => (
          <div className={styles.complete} aria-live="polite" ref={nodeRef}>
            <Heading level={3} as="h3" className={styles.completeTitle} data-status={status}>
              Message Sent
            </Heading>
            <Text
              size="l"
              as="p"
              className={styles.completeText}
              data-status={status}
              style={getDelay(tokens.base.durationXS)}
            >
              I'll get back to you within a couple days, sit tight
            </Text>
            <Button
              secondary
              iconHoverShift
              className={styles.completeButton}
              data-status={status}
              style={getDelay(tokens.base.durationM)}
              href="/"
              icon="chevron-right"
            >
              Back to homepage
            </Button>
          </div>
        )}
      </Transition>
      <Footer className={styles.footer} />
    </Section>
  );
};

function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}
