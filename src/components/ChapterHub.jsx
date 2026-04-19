import { motion, AnimatePresence } from 'framer-motion';
import ChapterCard from './ChapterCard';

export default function ChapterHub({
  chapters,
  isUnlocked,
  isCompleted,
  allCompleted,
  onSelectChapter,
  onViewFinal,
}) {
  const completedCount = chapters.filter(c => isCompleted(c.id)).length;

  const getStatus = (id) => {
    if (isCompleted(id)) return 'completed';
    if (isUnlocked(id))  return 'unlocked';
    return 'locked';
  };

  const subtitle = allCompleted
    ? 'All chapters complete.'
    : completedCount === 0
    ? 'Begin from Chapter 1.'
    : `${completedCount} of 7 chapters complete.`;

  return (
    <motion.div
      style={s.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ambient orb — gold, upper-right */}
      <motion.div
        style={s.orb}
        animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vignette */}
      <div style={s.vignette} />

      <div style={s.inner}>

        <div style={s.header}>
          <motion.h1
            style={s.title}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            Our Story
          </motion.h1>
          <motion.p
            style={s.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          style={s.grid}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {chapters.map(chapter => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              status={getStatus(chapter.id)}
              onClick={() => onSelectChapter(chapter.id)}
            />
          ))}
        </motion.div>

        <AnimatePresence>
          {allCompleted && (
            <motion.div
              style={s.finalCta}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
            >
              <p style={s.finalHint}>You've reached the end.</p>
              <motion.button
                onClick={onViewFinal}
                style={s.finalBtn}
                whileHover={{
                  borderColor: 'rgba(212,168,83,0.6)',
                  color: '#d4a853',
                  boxShadow: '0 0 28px rgba(212,168,83,0.15)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                Read the final message
              </motion.button>
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
    justifyContent: 'center',
    padding:        '3.5rem 1.25rem 4.5rem',
    boxSizing:      'border-box',
    overflow:       'hidden',
    background: [
      'radial-gradient(ellipse 75% 55% at 85% 10%, rgba(212,168,83,0.12) 0%, transparent 50%)',
      'radial-gradient(ellipse 80% 60% at 10% 85%, rgba(180,50,90,0.14) 0%, transparent 55%)',
      '#0e0709',
    ].join(', '),
  },
  orb: {
    position:     'absolute',
    borderRadius: '50%',
    width:        '420px',
    height:       '420px',
    background:   'radial-gradient(circle, rgba(212,168,83,0.16) 0%, transparent 70%)',
    filter:       'blur(85px)',
    top:          '-80px',
    right:        '-120px',
    pointerEvents:'none',
    zIndex:       0,
  },
  vignette: {
    position:   'absolute',
    inset:      0,
    background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(8,3,7,0.6) 100%)',
    pointerEvents: 'none',
    zIndex:     1,
  },
  inner: {
    position: 'relative',
    zIndex:   2,
    width:    '100%',
    maxWidth: '500px',
  },
  header: {
    marginBottom: '2.25rem',
  },
  title: {
    margin:        '0 0 0.5rem 0',
    fontSize:      'clamp(2rem, 5vw, 2.8rem)',
    fontWeight:    400,
    color:         '#f5eeea',
    fontFamily:    "'Cormorant Garamond', Georgia, serif",
    letterSpacing: '-0.01em',
    textShadow:    '0 0 60px rgba(212,168,83,0.3)',
  },
  subtitle: {
    margin:        0,
    fontSize:      '0.78rem',
    color:         '#4a4440',
    fontFamily:    'Inter, sans-serif',
    letterSpacing: '0.06em',
  },
  grid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap:                 '0.8rem',
    marginBottom:        '3rem',
  },
  finalCta: {
    textAlign:  'center',
    paddingTop: '2rem',
    borderTop:  '1px solid rgba(255,255,255,0.06)',
  },
  finalHint: {
    margin:     '0 0 1.25rem 0',
    fontSize:   '0.9rem',
    color:      '#5a5450',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontStyle:  'italic',
  },
  finalBtn: {
    background:    'rgba(255,255,255,0.02)',
    border:        '1px solid rgba(212,168,83,0.32)',
    borderRadius:  '6px',
    color:         '#8a7040',
    padding:       '0 2.5rem',
    minHeight:     '52px',
    fontSize:      '0.78rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    cursor:        'pointer',
    fontFamily:    'Inter, sans-serif',
    backdropFilter:'blur(8px)',
    transition:    'border-color 0.3s, color 0.3s, box-shadow 0.3s',
  },
};
