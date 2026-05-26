import { useState, useEffect, useRef, useCallback } from 'react';
import { useHydrated } from '~/hooks/useHydrated';
import styles from './music-player.module.css';

const PLAYLIST = [
  { id: 'kTJczUoc26U', title: 'Stay', artist: 'Justin Bieber', genre: 'Pop' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', genre: 'Pop' },
  { id: 'DyDfgMOUjCI', title: 'Bad Guy', artist: 'Billie Eilish', genre: 'Alt' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Bruno Mars', genre: 'Funk' },
  { id: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock' },
  { id: 'E07s5ZYygMg', title: 'Watermelon Sugar', artist: 'Harry Styles', genre: 'Pop' },
  { id: 'UceaB4D0jpo', title: 'Rockstar', artist: 'Post Malone', genre: 'Hip-Hop' },
  { id: 'TUVcZfQe-Kw', title: 'Levitating', artist: 'Dua Lipa', genre: 'Dance' },
  { id: '2Vv-BfVoq4g', title: 'Perfect', artist: 'Ed Sheeran', genre: 'Pop' },
  { id: 'lp-EBT53RRk', title: 'Starboy', artist: 'The Weeknd', genre: 'R&B' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const MusicPlayer = () => {
  // Render the canonical (un-shuffled) order on the server and during
  // the initial client render so the markup matches; once hydrated,
  // shuffle on the client only.
  const hydrated = useHydrated();
  const [playlist, setPlaylist] = useState(PLAYLIST);
  useEffect(() => {
    if (hydrated) setPlaylist(shuffle(PLAYLIST));
  }, [hydrated]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const progressTimer = useRef(null);
  const song = playlist[index];

  const loadPlayer = useCallback((videoId, autoplay = false) => {
    if (!window.YT || !window.YT.Player) return;
    if (playerRef.current) {
      playerRef.current.destroy();
    }
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        autoplay: autoplay ? 1 : 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (e) => {
          setReady(true);
          setDuration(e.target.getDuration());
          if (autoplay) {
            e.target.playVideo();
            setPlaying(true);
          }
        },
        onStateChange: (e) => {
          const YT = window.YT.PlayerState;
          if (e.data === YT.PLAYING) {
            setPlaying(true);
            setDuration(playerRef.current.getDuration());
          } else if (e.data === YT.PAUSED) {
            setPlaying(false);
          } else if (e.data === YT.ENDED) {
            handleNext(true);
          }
        },
      },
    });
  }, []);

  useEffect(() => {
    const initYT = () => loadPlayer(song.id, false);
    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      window.onYouTubeIframeAPIReady = initYT;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    }
    return () => clearInterval(progressTimer.current);
  }, []);

  useEffect(() => {
    if (playing) {
      progressTimer.current = setInterval(() => {
        if (playerRef.current?.getCurrentTime) {
          setProgress(playerRef.current.getCurrentTime());
          setDuration(playerRef.current.getDuration() || 0);
        }
      }, 500);
    } else {
      clearInterval(progressTimer.current);
    }
    return () => clearInterval(progressTimer.current);
  }, [playing]);

  const handlePlay = () => {
    if (!ready) {
      loadPlayer(song.id, true);
      return;
    }
    if (playing) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
  };

  const handleNext = useCallback((auto = false) => {
    const next = (index + 1) % playlist.length;
    setIndex(next);
    setProgress(0);
    setReady(false);
    setTimeout(() => loadPlayer(playlist[next].id, playing || auto), 100);
  }, [index, playlist, playing, loadPlayer]);

  const handlePrev = () => {
    const prev = (index - 1 + playlist.length) % playlist.length;
    setIndex(prev);
    setProgress(0);
    setReady(false);
    setTimeout(() => loadPlayer(playlist[prev].id, playing), 100);
  };

  const handleRandom = () => {
    const rand = Math.floor(Math.random() * playlist.length);
    setIndex(rand);
    setProgress(0);
    setReady(false);
    setTimeout(() => loadPlayer(playlist[rand].id, true), 100);
  };

  const handleSeek = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const seekTo = ratio * duration;
    playerRef.current?.seekTo(seekTo, true);
    setProgress(seekTo);
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const thumb = `https://img.youtube.com/vi/${song.id}/mqdefault.jpg`;
  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className={`${styles.player} ${minimized ? styles.minimized : ''}`}>
      {/* Hidden YT iframe */}
      <div className={styles.ytWrap}>
        <div ref={containerRef} />
      </div>

      {minimized ? (
        /* Mini pill */
        <button className={styles.pill} onClick={() => setMinimized(false)} title="Open player">
          <div className={`${styles.pillBars} ${playing ? styles.active : ''}`}>
            <span /><span /><span />
          </div>
          <span className={styles.pillText}>{playing ? `${song.title} · ${song.artist}` : 'Music'}</span>
          <span className={styles.pillGenre}>{song.genre}</span>
        </button>
      ) : (
        /* Full mini player */
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <span className={styles.genreTag}>{song.genre}</span>
            <button className={styles.closeBtn} onClick={() => setMinimized(true)} title="Minimize">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Art */}
          <div className={styles.artWrap}>
            <img src={thumb} alt={song.title} className={styles.art} />
            <div className={`${styles.artOverlay} ${playing ? styles.artPlaying : ''}`} />
          </div>

          {/* Info */}
          <div className={styles.info}>
            <p className={styles.title}>{song.title}</p>
            <p className={styles.artist}>{song.artist}</p>
          </div>

          {/* Progress */}
          <div className={styles.progressWrap} onClick={handleSeek}>
            <div className={styles.progressBg}>
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className={styles.times}>
            <span>{fmt(progress)}</span>
            <span>{fmt(duration)}</span>
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            {/* Random */}
            <button className={styles.ctrl} onClick={handleRandom} title="Random song">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>
            {/* Prev */}
            <button className={styles.ctrl} onClick={handlePrev} title="Previous">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            {/* Play/Pause */}
            <button className={styles.playBtn} onClick={handlePlay} title={playing ? 'Pause' : 'Play'}>
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            {/* Next */}
            <button className={styles.ctrl} onClick={() => handleNext()} title="Next">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
            {/* Bars indicator */}
            <div className={`${styles.bars} ${playing ? styles.barsActive : ''}`}>
              <span/><span/><span/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
