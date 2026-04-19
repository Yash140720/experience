import { motion } from 'framer-motion';

/**
 * status: 'locked' | 'unlocked' | 'completed'
 */
export default function ChapterCard({ chapter, status, onClick }) {
  const locked    = status === 'locked';
  const completed = status === 'completed';

  const cardBg = completed
    ? 'linear-gradient(135deg, rgba(212,168,83,0.08) 0%, rgba(180,130,50,0.04) 100%)'
    : locked
    ? 'rgba(255,255,255,0.015)'
    : 'rgba(255,255,255,0.03)';

  const borderColor = completed
    ? 'rgba(212,168,83,0.28)'
    : locked
    ? 'rgba(255,255,255,0.04)'
    : 'rgba(255,255,255,0.08)';

  return (
    <motion.div
      onClick={locked ? undefined : onClick}
      style={{
        ...s.card,
        background:  cardBg,
        opacity:     locked ? 0.35 : 1,
        cursor:      locked ? 'default' : 'pointer',
        borderColor,
        boxShadow:   completed
          ? '0 0 24px rgba(212,168,83,0.06), inset 0 1px 0 rgba(212,168,83,0.08)'
          : 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
      whileHover={!locked ? {
        y:          -4,
        borderColor: completed ? 'rgba(212,168,83,0.5)' : 'rgba(232,121,160,0.3)',
        boxShadow:   completed
          ? '0 8px 32px rgba(212,168,83,0.12), inset 0 1px 0 rgba(212,168,83,0.1)'
          : '0 8px 28px rgba(232,121,160,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
      } : {}}
      whileTap={!locked ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      <div style={s.top}>
        <span style={s.num}>Chapter {chapter.id}</span>
        {completed && <span style={s.badge}>✓</span>}
        {locked    && <span style={s.lock}>—</span>}
      </div>
      <h3 style={{
        ...s.title,
        color: locked    ? '#2e2b28'
             : completed ? '#d4a853'
             :              '#f0ece6',
        textShadow: completed ? '0 0 30px rgba(212,168,83,0.25)' : 'none',
      }}>
        {chapter.title}
      </h3>
    </motion.div>
  );
}

const s = {
  card: {
    border:       '1px solid',
    borderRadius: '12px',
    padding:      '1.2rem 1.4rem',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition:   'box-shadow 0.25s',
  },
  top: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   '0.55rem',
  },
  num: {
    fontSize:      '0.62rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color:         '#3a3632',
    fontFamily:    'Inter, sans-serif',
  },
  badge: {
    fontSize:   '0.7rem',
    color:      '#d4a853',
    fontFamily: 'Inter, sans-serif',
  },
  lock: {
    fontSize:   '0.7rem',
    color:      '#2a2724',
    fontFamily: 'Inter, sans-serif',
  },
  title: {
    margin:     0,
    fontSize:   '1rem',
    fontWeight: 400,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    lineHeight: 1.35,
  },
};
