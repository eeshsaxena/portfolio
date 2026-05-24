import { useState, useEffect, useRef } from 'react';
import styles from './music-player.module.css';

// "Stay" - The Kid LAROI & Justin Bieber
const YOUTUBE_VIDEO_ID = 'kTJczUoc26U';

export const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const playerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }, []);

  const initPlayer = () => {
    if (window.YT && window.YT.Player) {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: e => {
            e.target.playVideo();
            setLoaded(true);
            setPlaying(true);
          },
          onStateChange: e => {
            setPlaying(e.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    } else {
      // YT not ready yet, retry
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }
  };

  const handleToggle = () => {
    if (!loaded) {
      initPlayer();
      return;
    }
    if (playing) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Hidden YouTube iframe container */}
      <div className={styles.hidden}>
        <div ref={iframeRef} />
      </div>

      <button
        className={styles.button}
        onClick={handleToggle}
        title={playing ? 'Pause music' : 'Play: I Ain\'t Worried — OneRepublic'}
        aria-label={playing ? 'Pause background music' : 'Play background music'}
      >
        <div className={`${styles.ring} ${playing ? styles.ringActive : ''}`} />
        {playing ? (
          /* Pause icon */
          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          /* Music note icon */
          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        )}
        {playing && (
          <div className={styles.bars}>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </div>
        )}
      </button>
      <div className={`${styles.label} ${playing ? styles.labelVisible : ''}`}>
        Stay · Justin Bieber
      </div>
    </div>
  );
};
