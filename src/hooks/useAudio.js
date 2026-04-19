import { useRef, useState, useCallback } from 'react';

/**
 * Lightweight audio manager for background music.
 *
 * Usage:
 *   const { start, toggleMute, isMuted, isStarted } = useAudio(src);
 *
 * - Call start() once inside a user-gesture handler (e.g. "Begin" click).
 *   This satisfies iOS Safari's autoplay policy.
 * - Call toggleMute() to mute / unmute without pausing.
 * - isStarted becomes true after start() is called; use it to show the toggle.
 */
export function useAudio(src) {
  const audioRef   = useRef(null);
  const [isMuted,   setIsMuted]   = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const a  = new Audio(src);
      a.loop   = true;
      a.volume = 0.38;
      audioRef.current = a;
    }
    return audioRef.current;
  }, [src]);

  // Must be called directly inside a user-gesture handler for iOS.
  const start = useCallback(() => {
    if (isStarted) return;
    const a = ensureAudio();
    a.play().catch(() => {
      // Autoplay blocked — harmless; user can still hear via toggleMute.
    });
    setIsStarted(true);
  }, [isStarted, ensureAudio]);

  const toggleMute = useCallback(() => {
    const a = ensureAudio();
    if (a.paused) {
      // Audio is paused — either autoplay was blocked or start() was never called.
      // Use this user gesture to begin playback.
      a.muted = false;
      a.play().catch(() => {});
      setIsStarted(true);
      setIsMuted(false);
    } else {
      a.muted = !a.muted;
      setIsMuted(a.muted);
    }
  }, [ensureAudio]);

  return { start, toggleMute, isMuted, isStarted };
}
