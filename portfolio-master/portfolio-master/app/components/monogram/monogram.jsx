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
          {/* S */}
          <path d="M22 0h14a4 4 0 0 1 0 8H26a2 2 0 0 0 0 4h10a4 4 0 0 1 0 8H22v-5h10a2 2 0 0 0 0-4H22a4 4 0 0 1 0-8V0z" />
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
