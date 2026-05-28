import { useState, useEffect, useRef, useCallback } from 'react';
import { useHydrated } from '~/hooks/useHydrated';
import styles from './music-player.module.css';

const PLAYLIST = [
  { id: 'kTJczUoc26U', title: 'Stay', artist: 'Justin Bieber' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran' },
  { id: 'DyDfgMOUjCI', title: 'Bad Guy', artist: 'Billie Eilish' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Bruno Mars' },
  { id: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen' },
  { id: 'E07s5ZYygMg', title: 'Watermelon Sugar', artist: 'Harry Styles' },
  { id: 'UceaB4D0jpo', title: 'Rockstar', artist: 'Post Malone' },
  { id: 'TUVcZfQe-Kw', title: 'Levitating', artist: 'Dua Lipa' },
  { id: '2Vv-BfVoq4g', title: 'Perfect', artist: 'Ed Sheeran' },
  { id: 'lp-EBT53RRk', title: 'Starboy', artist: 'The Weeknd' },
];

// Background music stays subtle.
const VOLUME = 15;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const MusicPlayer = () => {
  const hydrated = useHydrated();
  const [playlist, setPlaylist] = useState(PLAYLIST);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const playlistRef = useRef(PLAYLIST);
  const indexRef = useRef(0);
  const mutedRef = useRef(true);

  useEffect(() => { playlistRef.current = playlist; }, [playlist]);
  useEffect(() => { indexRef.current = index; }, [index]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // Shuffle once on the client so the server/client markup matches.
  useEffect(() => {
    if (hydrated) {
      const shuffled = shuffle(PLAYLIST);
      playlistRef.current = shuffled;
      setPlaylist(shuffled);
    }
  }, [hydrated]);

  // Advance to the next track and loop back to the start at the end.
  const playNext = useCallback(() => {
    const list = playlistRef.current;
    const next = (indexRef.current + 1) % list.length;
    indexRef.current = next;
    setIndex(next);
    const p = playerRef.current;
    if (p?.loadVideoById) {
      p.loadVideoById(list[next].id);
      p.setVolume(VOLUME);
      if (mutedRef.current) p.mute(); else p.unMute();
    }
  }, []);

  useEffect(() => {
    const init = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: playlistRef.current[0].id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(VOLUME);
            e.target.mute(); // muted autoplay is allowed; user unmutes to hear it
            e.target.playVideo();
          },
          onStateChange: (e) => {
            const S = window.YT.PlayerState;
            if (e.data === S.PLAYING) setPlaying(true);
            else if (e.data === S.PAUSED) setPlaying(false);
            else if (e.data === S.ENDED) playNext();
          },
          onError: () => playNext(), // skip anything that won't play
        },
      });
    };

    if (window.YT && window.YT.Player) {
      init();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') prev();
        init();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    }

    return () => {
      try {
        playerRef.current?.destroy();
      } catch (e) {
        /* noop */
      }
    };
  }, [playNext]);

  const toggleMute = () => {
    const next = !mutedRef.current;
    setMuted(next); // reflect intent in the UI even if the player isn't ready yet
    const p = playerRef.current;
    try {
      if (next) {
        p?.mute?.();
      } else {
        p?.unMute?.();
        p?.setVolume?.(VOLUME);
        p?.playVideo?.(); // covers browsers that blocked the muted autoplay
      }
    } catch (e) {
      /* player API not ready; state already updated */
    }
  };

  const soundOn = !muted && playing;
  const song = playlist[index] || PLAYLIST[0];

  return (
    <div className={styles.player}>
      <div className={styles.ytWrap}>
        <div ref={containerRef} />
      </div>

      <button
        className={styles.pill}
        onClick={toggleMute}
        title={muted ? 'Play music' : 'Mute music'}
        aria-label={muted ? 'Unmute background music' : 'Mute background music'}
      >
        <span className={`${styles.pillBars} ${soundOn ? styles.active : ''}`}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.pillText}>
          {soundOn ? `${song.title} · ${song.artist}` : 'Music'}
        </span>
        {muted ? (
          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
            <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06A6.99 6.99 0 0 1 19 12zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4 9.91 6.09 12 8.18z" />
          </svg>
        ) : (
          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
      </button>
    </div>
  );
};
