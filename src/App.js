import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useUnlockProgress } from './hooks/useUnlockProgress';
import chapters from './data/chapters';
import IntroScreen from './components/IntroScreen';
import ChapterHub from './components/ChapterHub';
import ChapterScreen from './components/ChapterScreen';
import FinalReveal from './components/FinalReveal';

export default function App() {
  const [screen, setScreen]               = useState('intro'); // 'intro' | 'hub' | 'chapter' | 'final'
  const [activeChapterId, setActiveChapterId] = useState(null);

  const { isUnlocked, isCompleted, completeChapter, allCompleted } = useUnlockProgress();

  const activeChapter = chapters.find(c => c.id === activeChapterId) ?? null;

  const handleEnter = useCallback(() => {
    setScreen('hub');
  }, []);

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
  );
}
