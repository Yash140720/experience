import { motion } from 'framer-motion';

/**
 * Each line entry:
 *   text    — display string
 *   delay   — seconds before this line fades in
 *   hero    — larger, prominent treatment (dates)
 *   sub     — smaller, italic, muted (descriptive lines)
 *   finale  — the emotional peak line
 *   gold    — use gold accent colour instead of white (for 20 April)
 */
const LINES = [
  { text: 'Happy anniversary.',        delay: 0.8                       },
  { text: '18 February.',              delay: 2.4,  hero: true          },
  { text: 'The day you said it back.', delay: 3.5,  sub: true           },
  { text: '20 April.',                 delay: 5.2,  hero: true, gold: true },
  { text: 'The day it became ours.',   delay: 6.3,  sub: true           },
  { text: 'Three years.',              delay: 8.0                       },
  { text: 'Still choosing each other.',delay: 9.6                       },
  { text: 'I love you.',               delay: 12.2, finale: true        },
];

function Line({ text, delay, hero, sub, finale, gold }) {
  const fontSize =
    finale ? '2rem'   :
    hero   ? '2.4rem' :
    sub    ? '0.9rem' :
             '1rem';

  const color =
    finale ? '#e879a0' :
    gold   ? '#d4a853' :
    hero   ? '#f5eeea' :
    sub    ? '#5a5450' :
             '#8a827a';

  const textShadow =
    finale ? '0 0 80px rgba(232,121,160,0.55), 0 0 130px rgba(180,50,90,0.3)' :
    gold   ? '0 0 60px rgba(212,168,83,0.45), 0 0 100px rgba(180,130,50,0.25)' :
    hero   ? '0 0 50px rgba(232,121,160,0.28)' :
             'none';

  return (
    <motion.p
      style={{
        margin:        0,
        fontSize,
        color,
        fontFamily:    "'Cormorant Garamond', Georgia, serif",
        fontStyle:     sub ? 'italic' : 'normal',
        fontWeight:    400,
        lineHeight:    hero || finale ? 1.1 : 1.6,
        letterSpacing: hero || finale ? '-0.01em' : '0.01em',
        textShadow,
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {text}
    </motion.p>
  );
}

export default function FinalReveal() {
  return (
    <motion.div
      style={s.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Ambient orb — rose, upper-left */}
      <motion.div
        style={s.orbA}
        animate={{ scale: [1, 1.28, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Ambient orb — gold, lower-right */}
      <motion.div
        style={s.orbB}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Vignette */}
      <div style={s.vignette} />

      <div style={s.inner}>

        <div style={s.lines}>
          {LINES.map((line, i) => (
            <Line key={i} {...line} />
          ))}
        </div>

        <motion.span
          style={s.signature}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 13.8 }}
        >
          — always
        </motion.span>

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
    padding:        '3rem 1.5rem',
    boxSizing:      'border-box',
    overflow:       'hidden',
    background: [
      'radial-gradient(ellipse 80% 60% at 30% 12%, rgba(180,50,90,0.30) 0%, transparent 50%)',
      'radial-gradient(ellipse 60% 50% at 78% 78%, rgba(212,168,83,0.16) 0%, transparent 50%)',
      'radial-gradient(ellipse 70% 55% at 15% 80%, rgba(140,25,65,0.18) 0%, transparent 55%)',
      '#0e0709',
    ].join(', '),
  },
  orbA: {
    position:     'absolute',
    borderRadius: '50%',
    width:        '480px',
    height:       '480px',
    background:   'radial-gradient(circle, rgba(200,70,120,0.24) 0%, transparent 70%)',
    filter:       'blur(90px)',
    top:          '-130px',
    left:         '-130px',
    pointerEvents:'none',
    zIndex:       0,
  },
  orbB: {
    position:     'absolute',
    borderRadius: '50%',
    width:        '360px',
    height:       '360px',
    background:   'radial-gradient(circle, rgba(212,168,83,0.20) 0%, transparent 70%)',
    filter:       'blur(80px)',
    bottom:       '-90px',
    right:        '-90px',
    pointerEvents:'none',
    zIndex:       0,
  },
  vignette: {
    position:   'absolute',
    inset:      0,
    background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(8,3,7,0.7) 100%)',
    pointerEvents: 'none',
    zIndex:     1,
  },
  inner: {
    position: 'relative',
    zIndex:   2,
    width:    '100%',
    maxWidth: '520px',
  },
  lines: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '1rem',
    marginBottom:  '2.5rem',
  },
  signature: {
    display:       'block',
    fontSize:      '0.8rem',
    color:         '#3a3632',
    fontFamily:    "'Cormorant Garamond', Georgia, serif",
    fontStyle:     'italic',
    letterSpacing: '0.05em',
  },
};
