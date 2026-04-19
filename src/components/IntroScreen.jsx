import { motion } from 'framer-motion';

const fadeUp = (delay) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] },
});

const fadeIn = (delay) => ({
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  transition: { duration: 0.9, delay },
});

export default function IntroScreen({ onEnter }) {
  return (
    <motion.div
      style={s.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Ambient orb — rose, top-left */}
      <motion.div
        style={s.orbA}
        animate={{ scale: [1, 1.3, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Ambient orb — gold, bottom-right */}
      <motion.div
        style={s.orbB}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* Vignette */}
      <div style={s.vignette} />

      <div style={s.inner}>

        <motion.span style={s.label} {...fadeIn(0.5)}>
          a story in seven chapters
        </motion.span>

        <motion.h1 style={s.title} {...fadeUp(1.0)}>
          For You
        </motion.h1>

        <motion.div
          style={s.rule}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.7, ease: 'easeOut' }}
        />

        <motion.div {...fadeIn(2.0)}>
          <motion.button
            onClick={onEnter}
            style={s.btn}
            whileHover={{
              borderColor: 'rgba(232,121,160,0.6)',
              color: '#e879a0',
              boxShadow: '0 0 28px rgba(232,121,160,0.15)',
            }}
            whileTap={{ scale: 0.96 }}
          >
            Begin
          </motion.button>
        </motion.div>

      </div>
    </motion.div>
  );
}

const s = {
  screen: {
    position:       'relative',
    minHeight:      '100vh',
    minHeight:      '100dvh',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '2rem',
    boxSizing:      'border-box',
    overflow:       'hidden',
    background: [
      'radial-gradient(ellipse 90% 65% at 18% 12%, rgba(180,50,90,0.30) 0%, transparent 55%)',
      'radial-gradient(ellipse 65% 55% at 82% 82%, rgba(212,168,83,0.14) 0%, transparent 50%)',
      'radial-gradient(ellipse 60% 50% at 50% 110%, rgba(120,20,50,0.18) 0%, transparent 55%)',
      '#0e0709',
    ].join(', '),
  },
  orbA: {
    position:     'absolute',
    borderRadius: '50%',
    width:        '500px',
    height:       '500px',
    background:   'radial-gradient(circle, rgba(200,70,120,0.22) 0%, transparent 70%)',
    filter:       'blur(90px)',
    top:          '-140px',
    left:         '-150px',
    pointerEvents:'none',
    zIndex:       0,
  },
  orbB: {
    position:     'absolute',
    borderRadius: '50%',
    width:        '380px',
    height:       '380px',
    background:   'radial-gradient(circle, rgba(212,168,83,0.18) 0%, transparent 70%)',
    filter:       'blur(80px)',
    bottom:       '-100px',
    right:        '-100px',
    pointerEvents:'none',
    zIndex:       0,
  },
  vignette: {
    position:   'absolute',
    inset:      0,
    background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(8,3,7,0.65) 100%)',
    pointerEvents: 'none',
    zIndex:     1,
  },
  inner: {
    position:      'relative',
    zIndex:        2,
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    textAlign:     'center',
  },
  label: {
    display:       'block',
    fontSize:      '0.72rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color:         '#6a5a54',
    fontFamily:    'Inter, sans-serif',
    marginBottom:  '1.5rem',
  },
  title: {
    margin:        '0 0 1.75rem 0',
    fontSize:      'clamp(3.2rem, 11vw, 6rem)',
    fontWeight:    400,
    color:         '#f5eeea',
    fontFamily:    "'Cormorant Garamond', Georgia, serif",
    letterSpacing: '-0.02em',
    lineHeight:    1,
    textShadow:    '0 0 80px rgba(232,121,160,0.45), 0 0 140px rgba(180,50,90,0.25)',
  },
  rule: {
    width:           '52px',
    height:          '1px',
    background:      'linear-gradient(90deg, rgba(232,121,160,0.7) 0%, rgba(212,168,83,0.5) 100%)',
    marginBottom:    '1.85rem',
    transformOrigin: 'left center',
  },
  btn: {
    background:    'rgba(255,255,255,0.03)',
    border:        '1px solid rgba(255,255,255,0.16)',
    borderRadius:  '6px',
    color:         '#9a9088',
    padding:       '0.9rem 3.2rem',
    fontSize:      '0.78rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    cursor:        'pointer',
    fontFamily:    'Inter, sans-serif',
    backdropFilter:'blur(8px)',
    transition:    'border-color 0.3s, color 0.3s, box-shadow 0.3s',
  },
};
