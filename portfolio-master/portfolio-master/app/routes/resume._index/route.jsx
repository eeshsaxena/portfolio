import { DecoderText } from '~/components/decoder-text';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import styles from './resume.module.css';

const RESUME_PDF = '/resume.pdf';

export function meta({ matches }) {
  const canonicalUrl = matches.find(m => m.id === 'root')?.data?.canonicalUrl;
  return baseMeta({
    title: 'Résumé',
    description:
      'View or download the résumé of Eesh Saxena, an AI/ML researcher and software engineer studying CS Engineering at IIIT Senapati.',
    canonicalUrl,
  });
}

export default function Resume() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.label}>// Résumé</span>
          <h1 className={styles.title}>
            <DecoderText text="Résumé" delay={300} />
          </h1>
        </div>
        <div className={styles.meta}>
          <p className={styles.tagline}>
            The one-page version: read it inline or grab the PDF.
          </p>
          <div className={styles.actions}>
            <a
              className={styles.downloadBtn}
              href={RESUME_PDF}
              download="Eesh_Saxena_Resume.pdf"
            >
              ↓ Download PDF
            </a>
            <a
              className={styles.openBtn}
              href={RESUME_PDF}
              target="_blank"
              rel="noopener noreferrer"
            >
              ⤢ Open in new tab
            </a>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <object
          className={styles.viewer}
          data={`${RESUME_PDF}#view=FitH`}
          type="application/pdf"
          aria-label="Résumé PDF preview"
        >
          <div className={styles.fallback}>
            <p>Your browser can’t preview PDFs inline.</p>
            <a
              className={styles.downloadBtn}
              href={RESUME_PDF}
              download="Eesh_Saxena_Resume.pdf"
            >
              ↓ Download the résumé
            </a>
          </div>
        </object>
      </div>

      <Footer />
    </div>
  );
}
