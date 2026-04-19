import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUnlockProgress } from './hooks/useUnlockProgress';
import { useAudio } from './hooks/useAudio';
import chapters from './data/chapters';
import IntroScreen from './components/IntroScreen';
import ChapterHub from './components/ChapterHub';
import ChapterScreen from './components/ChapterScreen';
import FinalReveal from './components/FinalReveal';
// Audio is served from /public/audio/ so the build succeeds even before the file is added.
const OUR_SONG = process.env.PUBLIC_URL + '/audio/our-song.mp3';

// ─── Music toggle ─────────────────────────────────────────────────────────────

function MusicToggle({ isMuted, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      style={musicBtnStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: isMuted ? 0.28 : 0.55 }}
      transition={{ duration: 0.6 }}
      whileHover={{ opacity: 0.9 }}
      whileTap={{ scale: 0.88 }}
      aria-label={isMuted ? 'Unmute music' : 'Mute music'}
    >
      {isMuted ? '♪' : '♫'}
    </motion.button>
  );
}

const musicBtnStyle = {
  position:         'fixed',
  top:              '1.4rem',
  right:            '1.4rem',
  background:       'none',
  border:           'none',
  color:            '#e8e0d8',
  fontSize:         '1.1rem',
  cursor:           'pointer',
  padding:          '0.4rem 0.5rem',
  zIndex:           200,
  lineHeight:       1,
  userSelect:       'none',
  WebkitUserSelect: 'none',
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen]               = useState('intro'); // 'intro' | 'hub' | 'chapter' | 'final'
  const [activeChapterId, setActiveChapterId] = useState(null);

  const { isUnlocked, isCompleted, completeChapter, allCompleted } = useUnlockProgress();
  const { start: startMusic, toggleMute, isMuted, isStarted } = useAudio(OUR_SONG);

  const activeChapter = chapters.find(c => c.id === activeChapterId) ?? null;

  const handleEnter = useCallback(() => {
    startMusic();   // called directly inside user gesture — satisfies iOS autoplay
    setScreen('hub');
  }, [startMusic]);

  const handleSelectChapter = useCallback((id) => {
    setActiveChapterId(id);
    setScreen('chapter');
  }, []);

  const handleChapterComplete = useCallback((id) => {
    // Check before updating state: are all OTHER chapters already done?
    // If so, this completion makes the experience fully complete.
    const willBeAllCompleted = chapters.every(c => c.id === id || isCompleted(c.id));
    completeChapter(id);
    if (willBeAllCompleted) {
      // ChapterScreen's ending animation runs for ~2000ms before calling this.
      // A short additional delay lets the zoom/dim linger before the cut to FinalReveal.
      setTimeout(() => setScreen('final'), 350);
    } else {
      setTimeout(() => setScreen('hub'), 700);
    }
  }, [completeChapter, isCompleted]);

  const handleBackToHub = useCallback(() => {
    setScreen('hub');
  }, []);

  const handleViewFinal = useCallback(() => {
    setScreen('final');
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <IntroScreen
            key="intro"
            onEnter={handleEnter}
          />
        )}

        {screen === 'hub' && (
          <ChapterHub
            key="hub"
            chapters={chapters}
            isUnlocked={isUnlocked}
            isCompleted={isCompleted}
            allCompleted={allCompleted}
            onSelectChapter={handleSelectChapter}
            onViewFinal={handleViewFinal}
          />
        )}

        {screen === 'chapter' && activeChapter && (
          <ChapterScreen
            key={`chapter-${activeChapterId}`}
            chapter={activeChapter}
            onComplete={handleChapterComplete}
            onBack={handleBackToHub}
          />
        )}

        {screen === 'final' && (
          <FinalReveal key="final" />
        )}
      </AnimatePresence>

      {/* Music toggle — rendered outside AnimatePresence so it persists across screens */}
      {isStarted && (
        <MusicToggle isMuted={isMuted} onToggle={toggleMute} />
      )}
    </>
  );
}
