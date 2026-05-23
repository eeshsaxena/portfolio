import { forwardRef, useId } from 'react';
import { classes } from '~/utils/style';
import styles from './monogram.module.css';

export const Monogram = forwardRef(({ highlight, className, ...props }, ref) => {
  const id = useId();
  const clipId = `${id}monogram-clip`;

  return (
    <svg
      aria-hidden
      className={classes(styles.monogram, className)}
      width="48"
      height="29"
      viewBox="0 0 48 29"
      ref={ref}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          {/* E */}
          <path d="M0 0h14v5H6v7h10v5H6v7h8v5H0z" />
          {/* S — five rectangles: top bar, top-right arm, middle bar, bottom-left arm, bottom bar */}
          <path d="M22 0h14v5H22z M31 5h5v7h-5z M22 12h14v5H22z M22 17h5v7h-5z M22 24h14v5H22z" />
        </clipPath>
      </defs>
      <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
      {highlight && (
        <g clipPath={`url(#${clipId})`}>
          <rect className={styles.highlight} width="100%" height="100%" />
        </g>
      )}
    </svg>
  );
});
