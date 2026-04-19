import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedText from './AnimatedText';
import InteractionGate from './InteractionGate';

// ─── ChapterImage ─────────────────────────────────────────────────────────────

function ChapterImage({ src, revealStyle, objectPosition = 'center center' }) {
  const isBlur  = revealStyle === 'blur' || revealStyle === 'slow-blur';
  const blurMs  = revealStyle === 'slow-blur' ? 2800 : 1500;
  const scaleMs = blurMs + 400;
  const [blurDone, setBlurDone] = useState(false);

  useEffect(() => {
    if (!isBlur) return;
    const t = setTimeout(() => setBlurDone(true), 920);
    return () => clearTimeout(t);
  }, [isBlur]);

  return (
    <motion.div
      style={s.imgWrap}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          ...s.img,
          objectPosition,
          filter:    isBlur ? (blurDone ? 'blur(0px) saturate(1)'    : 'blur(18px) saturate(0.45)') : 'none',
          transform: isBlur ? (blurDone ? 'scale(1)'                  : 'scale(1.07)')               : 'none',
          transition: isBlur
            ? `filter ${blurMs}ms cubic-bezier(0.25,0.1,0.25,1), transform ${scaleMs}ms cubic-bezier(0.25,0.1,0.25,1)`
            : 'none',
        }}
        loading="lazy"
      />
      <div style={s.imgVignette} />
    </motion.div>
  );
}

// ─── ChapterScreen ────────────────────────────────────────────────────────────

// How long the ending zoom/dim plays before onComplete fires.
// TilesGate already waits 1200ms after last tile — this is additional.
const ENDING_DURATION_MS = 1500;

export default function ChapterScreen({ chapter, onComplete, onBack }) {
  const [phase,    setPhase]    = useState('lines'); // 'lines' | 'memory' | 'gate'
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    setPhase('lines');
    setIsEnding(false);
  }, [chapter.id]);

  const handleLinesComplete = useCallback(() => {
    setPhase('memory');
  }, []);

  useEffect(() => {
    if (phase !== 'memory') return;
    const delay = chapter.memoryDelay ?? 1200;
    const timer = setTimeout(() => setPhase('gate'), delay);
    return () => clearTimeout(timer);
  }, [phase, chapter.memoryDelay]);

  const handleMemoryTap = useCallback(() => {
    if (phase === 'memory') setPhase('gate');
  }, [phase]);

  const handleUnlock = useCallback(() => {
    if (chapter.ending) {
      // Play the zoom/dim ending animation, then signal the parent.
      // Parent (App.js) will navigate to FinalReveal, not back to hub.
      setIsEnding(true);
      setTimeout(() => onComplete(chapter.id), ENDING_DURATION_MS);
    } else {
      onComplete(chapter.id);
    }
  }, [chapter.id, chapter.ending, onComplete]);

  const hasImage = Boolean(chapter.image);
  const isCold   = chapter.theme === 'cold';

  const screenBackground = chapter.screenBg
    ? chapter.screenBg.join(', ')
    : [
        'radial-gradient(ellipse 85% 55% at 15% 10%, rgba(180,50,90,0.18) 0%, transparent 50%)',
        'radial-gradient(ellipse 60% 45% at 90% 85%, rgba(212,168,83,0.10) 0%, transparent 50%)',
        '#0e0709',
      ].join(', ');

  return (
    <motion.div
      style={{ ...s.screen, background: screenBackground }}
      initial={{ opacity: 0 }}
      animate={isEnding ? { scale: 1.04, opacity: 0.45 } : { scale: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={isEnding
        ? { duration: 1.3, ease: [0.25, 0.1, 0.25, 1] }
        : { duration: 0.7 }
      }
    >
      {/* Back button — hidden once ending animation begins */}
      {onBack && !isEnding && (
        <motion.button
          onClick={onBack}
          style={s.backBtn}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          whileHover={{ color: '#6a6460' }}
        >
          ←
        </motion.button>
      )}

      {/* Freeze all pointer events once the ending animation is running */}
      <div style={{ ...s.inner, pointerEvents: isEnding ? 'none' : 'auto' }}>

        <motion.div
          style={s.meta}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Chapter {chapter.id}
          <span style={s.metaSep}>/</span>
          7
        </motion.div>

        <motion.h2
          style={s.title}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {chapter.title}
        </motion.h2>

        <motion.div
          style={{
            ...s.rule,
            background: isCold
              ? 'linear-gradient(90deg, rgba(100,90,130,0.35) 0%, rgba(80,70,110,0.15) 45%, transparent 100%)'
              : 'linear-gradient(90deg, rgba(232,121,160,0.45) 0%, rgba(212,168,83,0.25) 45%, transparent 100%)',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
        />

        <div style={s.linesWrap}>
          <AnimatedText
            lines={chapter.lines}
            onComplete={handleLinesComplete}
            pacing={chapter.linePacing ?? 'normal'}
          />
        </div>

        {/* Photo reveal — above the memory card */}
        <AnimatePresence>
          {(phase === 'memory' || phase === 'gate') && hasImage && (
            <ChapterImage
              key="chapter-image"
              src={chapter.image.src}
              revealStyle={chapter.image.revealStyle}
              objectPosition={chapter.image.objectPosition}
            />
          )}
        </AnimatePresence>

        {/* Memory card */}
        <AnimatePresence>
          {(phase === 'memory' || phase === 'gate') && (
            <motion.div
              key="memory"
              style={{
                ...s.memoryCard,
                ...(isCold ? s.memoryCardCold : {}),
                cursor: phase === 'memory' ? 'pointer' : 'default',
              }}
              onClick={handleMemoryTap}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1,
                delay:    hasImage ? 0.55 : 0.2,
                ease:     'easeOut',
              }}
            >
              <span style={{ ...s.memoryLabel, ...(isCold ? s.memoryLabelCold : {}) }}>
                memory
              </span>
              <p style={s.memoryText}>{chapter.memory}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'gate' && (
            <motion.div
              key="gate"
              style={s.gateWrap}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <InteractionGate interaction={chapter.interaction} onUnlock={handleUnlock} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}

const s = {
  screen: {
    position:       'relative',
    minHeight:      '100dvh',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '2.5rem 1.25rem',
    boxSizing:      'border-box',
  },
  inner: {
    position: 'relative',
    zIndex:   1,
    width:    '100%',
    maxWidth: '480px',
  },
  meta: {
    fontSize:      '0.68rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color:         '#3e3a36',
    fontFamily:    'Inter, sans-serif',
    marginBottom:  '1.25rem',
  },
  metaSep: {
    margin: '0 0.45em',
    color:  '#2e2b28',
  },
  title: {
    margin:        '0 0 1.2rem 0',
    fontSize:      'clamp(1.65rem, 5vw, 2.2rem)',
    fontWeight:    400,
    color:         '#f5eeea',
    fontFamily:    "'Cormorant Garamond', Georgia, serif",
    letterSpacing: '-0.01em',
    lineHeight:    1.25,
    textShadow:    '0 0 50px rgba(232,121,160,0.2)',
  },
  rule: {
    height:          '1px',
    marginBottom:    '2rem',
    transformOrigin: 'left center',
  },
  linesWrap: {
    marginBottom: '2.25rem',
    minHeight:    '5rem',
  },
  imgWrap: {
    position:     'relative',
    width:        '100%',
    aspectRatio:  '4 / 5',
    borderRadius: '16px',
    overflow:     'hidden',
    marginBottom: '1.75rem',
    boxShadow:    '0 8px 48px rgba(180,50,90,0.18), 0 2px 12px rgba(0,0,0,0.4)',
  },
  img: {
    width:     '100%',
    height:    '100%',
    objectFit: 'cover',
    display:   'block',
  },
  imgVignette: {
    position: 'absolute',
    inset:    0,
    background: [
      'linear-gradient(to bottom, rgba(8,3,7,0.18) 0%, transparent 22%, transparent 52%, rgba(8,3,7,0.62) 100%)',
      'radial-gradient(ellipse 110% 105% at 50% 50%, transparent 32%, rgba(8,3,7,0.28) 100%)',
    ].join(', '),
    pointerEvents: 'none',
  },
  memoryCard: {
    background:           'linear-gradient(135deg, rgba(232,121,160,0.06) 0%, rgba(212,168,83,0.04) 100%)',
    backdropFilter:       'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border:               '1px solid rgba(232,121,160,0.14)',
    borderRadius:         '14px',
    padding:              '1.35rem 1.5rem',
    marginBottom:         '2.5rem',
    boxShadow:            '0 0 50px rgba(232,121,160,0.07), 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)',
  },
  memoryLabel: {
    display:       'block',
    fontSize:      '0.62rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color:         '#e879a0',
    marginBottom:  '0.65rem',
    fontFamily:    'Inter, sans-serif',
  },
  memoryCardCold: {
    background: 'linear-gradient(135deg, rgba(60,55,80,0.08) 0%, rgba(30,25,40,0.05) 100%)',
    border:     '1px solid rgba(120,110,150,0.12)',
    boxShadow:  '0 0 50px rgba(40,35,55,0.1), 0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
  },
  memoryLabelCold: {
    color: '#7a7090',
  },
  memoryText: {
    margin:     0,
    fontSize:   '0.97rem',
    lineHeight: 1.85,
    color:      '#9a9088',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontStyle:  'italic',
  },
  gateWrap: {
    display:        'flex',
    justifyContent: 'center',
  },
  backBtn: {
    position:   'fixed',
    top:        '1.4rem',
    left:       '1.4rem',
    background: 'none',
    border:     'none',
    color:      '#2a2724',
    fontSize:   '1.1rem',
    cursor:     'pointer',
    padding:    '0.5rem 0.75rem',
    fontFamily: 'Inter, sans-serif',
    zIndex:     10,
  },
};
