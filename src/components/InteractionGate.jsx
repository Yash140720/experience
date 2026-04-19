import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

// ─── Router ──────────────────────────────────────────────────────────────────

export default function InteractionGate({ interaction, onUnlock }) {
  switch (interaction.type) {
    case 'tap':       return <TapGate       interaction={interaction} onUnlock={onUnlock} />;
    case 'question':  return <QuestionGate  interaction={interaction} onUnlock={onUnlock} />;
    case 'hold':      return <HoldGate      interaction={interaction} onUnlock={onUnlock} />;
    case 'heartbeat': return <HeartbeatGate interaction={interaction} onUnlock={onUnlock} />;
    case 'choice':    return <ChoiceGate    interaction={interaction} onUnlock={onUnlock} />;
    case 'drag':      return <DragGate      interaction={interaction} onUnlock={onUnlock} />;
    case 'letter':    return <LetterGate    interaction={interaction} onUnlock={onUnlock} />;
    case 'tiles':     return <TilesGate     interaction={interaction} onUnlock={onUnlock} />;
    default:          return null;
  }
}

// ─── Tap ─────────────────────────────────────────────────────────────────────

function TapGate({ interaction, onUnlock }) {
  return (
    <motion.button
      onClick={onUnlock}
      style={s.tapBtn}
      whileHover={{ borderColor: 'rgba(232,121,160,0.5)', color: '#e879a0' }}
      whileTap={{ scale: 0.96 }}
    >
      {interaction.label ?? 'Continue'}
    </motion.button>
  );
}

// ─── Question ────────────────────────────────────────────────────────────────

function QuestionGate({ interaction, onUnlock }) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'error' | 'correct'

  const submit = () => {
    const input = value.toLowerCase().trim();
    if (!input) return;

    if (interaction.openEnded) {
      setStatus('correct');
      setTimeout(onUnlock, 500);
      return;
    }

    const accepted = (interaction.accepted ?? []).map(a => a.toLowerCase().trim());
    if (accepted.includes(input)) {
      setStatus('correct');
      setTimeout(onUnlock, 600);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1600);
    }
  };

  const borderColor =
    status === 'error'   ? 'rgba(232,121,121,0.4)'  :
    status === 'correct' ? 'rgba(121,232,160,0.5)'  :
                           'rgba(255,255,255,0.12)';

  return (
    <div style={{ ...s.gateBlock, maxWidth: '400px' }}>
      <p style={s.prompt}>{interaction.prompt}</p>
      <div style={s.inputRow}>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          placeholder="your answer…"
          disabled={status === 'correct'}
          style={{ ...s.input, borderColor }}
          autoComplete="off"
          spellCheck={false}
        />
        <motion.button
          onClick={submit}
          disabled={!value.trim() || status === 'correct'}
          style={s.submitBtn}
          whileTap={{ scale: 0.92 }}
        >
          →
        </motion.button>
      </div>
      {status === 'error' && (
        <motion.p
          style={s.errorMsg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          not quite — try again
        </motion.p>
      )}
    </div>
  );
}

// ─── Hold ────────────────────────────────────────────────────────────────────

function HoldGate({ interaction, onUnlock }) {
  const [progress, setProgress] = useState(0);
  const intervalRef  = useRef(null);
  const unlockedRef  = useRef(false);
  const duration     = interaction.durationMs ?? 2000;
  const TICK         = 50;

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const startHold = () => {
    if (unlockedRef.current) return;
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        const next = p + TICK / duration;
        if (next >= 1) {
          clearInterval(intervalRef.current);
          unlockedRef.current = true;
          onUnlock();
          return 1;
        }
        return next;
      });
    }, TICK);
  };

  const stopHold = () => {
    clearInterval(intervalRef.current);
    if (!unlockedRef.current) setProgress(0);
  };

  return (
    <div style={s.centeredCol}>
      <div
        role="button"
        style={s.holdBtn}
        onMouseDown={startHold}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={e => { e.preventDefault(); startHold(); }}
        onTouchEnd={stopHold}
        onTouchCancel={stopHold}
        onContextMenu={e => e.preventDefault()}
      >
        {interaction.label ?? 'Hold'}
      </div>
      <div style={s.progressTrack}>
        <div style={{ ...s.progressFill, width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

// ─── Heartbeat ───────────────────────────────────────────────────────────────
// A glowing heart that pulses with a lub-dub rhythm while held.
// Progress is expressed as glow intensity — no bar.

function HeartbeatGate({ interaction, onUnlock }) {
  const [holding,  setHolding]  = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const intervalRef  = useRef(null);
  const unlockedRef  = useRef(false);
  const glowP        = useMotionValue(0);
  const glowSize     = useTransform(glowP, [0, 1], [70,  200]);
  const glowOpacity  = useTransform(glowP, [0, 1], [0.2, 0.75]);
  const duration     = interaction.durationMs ?? 2800;
  const TICK         = 50;

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const startHold = () => {
    if (unlockedRef.current) return;
    setHolding(true);
    intervalRef.current = setInterval(() => {
      const next = Math.min(glowP.get() + TICK / duration, 1);
      glowP.set(next);
      if (next >= 1) {
        clearInterval(intervalRef.current);
        unlockedRef.current = true;
        setUnlocked(true);
        setTimeout(onUnlock, 700);
      }
    }, TICK);
  };

  const stopHold = () => {
    clearInterval(intervalRef.current);
    if (!unlockedRef.current) {
      setHolding(false);
      animate(glowP, 0, { duration: 0.5, ease: 'easeOut' });
    }
  };

  return (
    <div style={s.centeredCol}>
      {/* glow ring — driven by motion value, no re-renders */}
      <div style={s.heartContainer}>
        <motion.div
          style={{
            position:     'absolute',
            borderRadius: '50%',
            width:         glowSize,
            height:        glowSize,
            opacity:       glowOpacity,
            background:   'radial-gradient(circle, rgba(232,121,160,0.7) 0%, transparent 70%)',
            filter:       'blur(28px)',
            pointerEvents:'none',
          }}
        />

        {/* heart button */}
        <div
          role="button"
          aria-label={interaction.label ?? 'Hold'}
          style={{
            ...s.heartBtn,
            borderColor: unlocked
              ? 'rgba(232,121,160,0.55)'
              : 'rgba(232,121,160,0.2)',
            boxShadow: unlocked
              ? '0 0 32px rgba(232,121,160,0.4)'
              : '0 0 12px rgba(232,121,160,0.1)',
            cursor: unlocked ? 'default' : 'pointer',
          }}
          onMouseDown={startHold}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={e => { e.preventDefault(); startHold(); }}
          onTouchEnd={stopHold}
          onTouchCancel={stopHold}
          onContextMenu={e => e.preventDefault()}
        >
          <motion.span
            style={s.heartSymbol}
            animate={
              holding && !unlocked
                ? { scale: [1, 1.22, 0.9, 1.18, 1] }
                : unlocked
                ? { scale: 1.1, opacity: 1 }
                : { scale: 1 }
            }
            transition={
              holding && !unlocked
                ? { duration: 0.72, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.4 }
            }
          >
            ♥
          </motion.span>
        </div>
      </div>

      <AnimatePresence>
        {!unlocked && (
          <motion.p
            style={s.heartLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {interaction.label ?? 'hold'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Choice ──────────────────────────────────────────────────────────────────
// If interaction.allCorrect is true, every option advances — no wrong state.

function ChoiceGate({ interaction, onUnlock }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [wrongIndex, setWrongIndex]       = useState(null);

  const handleChoice = index => {
    if (selectedIndex !== null) return;

    if (interaction.allCorrect) {
      setSelectedIndex(index);
      setTimeout(onUnlock, 700);
      return;
    }

    if (index === interaction.correct) {
      setSelectedIndex(index);
      setTimeout(onUnlock, 700);
    } else {
      setWrongIndex(index);
      setTimeout(() => setWrongIndex(null), 900);
    }
  };

  return (
    <div style={{ ...s.gateBlock, maxWidth: '360px' }}>
      <p style={s.prompt}>{interaction.prompt}</p>
      <div style={s.choiceList}>
        {interaction.options.map((opt, i) => {
          const isSelected = selectedIndex === i;
          const isWrong    = !interaction.allCorrect && wrongIndex === i;
          return (
            <motion.button
              key={i}
              onClick={() => handleChoice(i)}
              disabled={selectedIndex !== null}
              style={{
                ...s.choiceBtn,
                borderColor: isSelected ? 'rgba(232,121,160,0.55)'
                           : isWrong    ? 'rgba(232,121,121,0.35)'
                           :               'rgba(255,255,255,0.08)',
                color: isSelected ? '#e879a0' : '#ede8e2',
              }}
              animate={isWrong ? { x: [-4, 4, -2, 2, 0] } : { x: 0 }}
              transition={{ duration: 0.35 }}
              whileHover={selectedIndex === null ? { borderColor: 'rgba(255,255,255,0.18)' } : {}}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Drag ────────────────────────────────────────────────────────────────────

const TRACK_W   = 220;
const HANDLE_SZ = 36;
const PADDING   = 4;
const DRAG_MAX  = TRACK_W - HANDLE_SZ - PADDING * 2;  // 176px
const THRESHOLD = DRAG_MAX * 0.72;

function DragGate({ interaction, onUnlock }) {
  const x         = useMotionValue(0);
  const blurStyle = useTransform(x, [0, DRAG_MAX], ['blur(10px)', 'blur(0px)']);
  const opacStyle = useTransform(x, [0, DRAG_MAX], [0.25, 1]);
  const [done, setDone] = useState(false);

  const handleDragEnd = () => {
    if (done) return;
    if (x.get() >= THRESHOLD) {
      animate(x, DRAG_MAX, { duration: 0.22, ease: 'easeOut' });
      setDone(true);
      setTimeout(onUnlock, 450);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 380, damping: 30 });
    }
  };

  return (
    <div style={s.centeredCol}>
      <div style={s.revealTextWrap}>
        <motion.span style={{ ...s.revealText, filter: blurStyle, opacity: opacStyle }}>
          {interaction.revealText}
        </motion.span>
      </div>
      <div style={s.dragTrack}>
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: DRAG_MAX }}
          dragElastic={0}
          dragMomentum={false}
          style={{ ...s.dragHandle, x }}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
        />
        {!done && (
          <span style={s.dragHint}>{interaction.label ?? 'drag to reveal'} →</span>
        )}
      </div>
    </div>
  );
}

// ─── Letter ──────────────────────────────────────────────────────────────────
// A sealed card that the user slides open to reveal a line inside.

const LETTER_H  = 190;
const LETTER_OPEN_THRESHOLD = LETTER_H * 0.55;

function LetterGate({ interaction, onUnlock }) {
  const y      = useMotionValue(0);
  const [opened, setOpened] = useState(false);

  const handleDragEnd = () => {
    if (y.get() < -LETTER_OPEN_THRESHOLD) {
      animate(y, -(LETTER_H + 30), { duration: 0.38, ease: 'easeOut' });
      setOpened(true);
      setTimeout(onUnlock, 1100);
    } else {
      animate(y, 0, { type: 'spring', stiffness: 280, damping: 26 });
    }
  };

  return (
    <div style={s.centeredCol}>
      <div style={s.letterWrap}>
        {/* Revealed text — sits underneath the seal */}
        <div style={s.letterBase}>
          <motion.p
            style={s.letterInner}
            animate={{ opacity: opened ? 1 : 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            {interaction.revealText}
          </motion.p>
        </div>

        {/* Seal overlay — drag this upward to open */}
        <motion.div
          drag="y"
          dragConstraints={{ top: -(LETTER_H + 30), bottom: 0 }}
          dragElastic={0.08}
          dragMomentum={false}
          style={{ ...s.letterSeal, y }}
          onDragEnd={handleDragEnd}
        >
          <div style={s.sealCircle}>
            <span style={{ color: '#c8a060', fontSize: '0.8rem', lineHeight: 1 }}>♥</span>
          </div>
          <p style={s.sealText}>{interaction.sealText ?? 'for you, always'}</p>
          <span style={s.openHint}>↑ slide to open</span>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Tiles ───────────────────────────────────────────────────────────────────
// Frosted-glass panels; tap each to dissolve and reveal a word/phrase beneath.

function Tile({ text, revealed, onTap }) {
  return (
    <div
      style={{
        ...s.tileOuter,
        cursor: revealed ? 'default' : 'pointer',
      }}
      onClick={revealed ? undefined : onTap}
    >
      {/* text underneath — always rendered, fades in when revealed */}
      <motion.span
        style={s.tileText}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
      >
        {text}
      </motion.span>

      {/* frosted overlay — dissolves on tap */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            style={s.tileOverlay}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TilesGate({ interaction, onUnlock }) {
  const tiles   = interaction.tiles ?? ['...', '...', '...'];
  const [revealed, setRevealed] = useState(new Array(tiles.length).fill(false));
  const [started,  setStarted]  = useState(false);
  const [done,     setDone]     = useState(false);

  const tap = (i) => {
    if (revealed[i] || done) return;
    if (!started) setStarted(true);
    const next = [...revealed];
    next[i] = true;
    setRevealed(next);
    if (next.every(Boolean)) {
      setDone(true);
      setTimeout(onUnlock, 1200);
    }
  };

  return (
    <div style={s.tilesWrap}>
      {tiles.map((text, i) => (
        <Tile key={i} text={text} revealed={revealed[i]} onTap={() => tap(i)} />
      ))}

      <AnimatePresence>
        {!started && (
          <motion.p
            style={s.tileHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            tap each panel to reveal
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
  // shared
  gateBlock: {
    width: '100%',
  },
  centeredCol: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    gap:           '1rem',
  },
  prompt: {
    margin:     '0 0 1.1rem 0',
    fontSize:   '1rem',
    fontStyle:  'italic',
    color:      '#9a9088',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    lineHeight: 1.65,
  },

  // tap
  tapBtn: {
    background:    'transparent',
    border:        '1px solid rgba(255,255,255,0.14)',
    borderRadius:  '6px',
    color:         '#c8c0b8',
    padding:       '0 2.75rem',
    minHeight:     '52px',
    fontSize:      '0.78rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor:        'pointer',
    fontFamily:    'Inter, sans-serif',
  },

  // question
  inputRow: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  input: {
    flex:         1,
    background:   'rgba(255,255,255,0.04)',
    border:       '1px solid',
    borderRadius: '6px',
    padding:      '0.75rem 0.9rem',
    color:        '#ede8e2',
    fontSize:     '1rem',
    fontFamily:   'Inter, sans-serif',
    outline:      'none',
    transition:   'border-color 0.3s',
  },
  submitBtn: {
    background:     'transparent',
    border:         '1px solid rgba(255,255,255,0.14)',
    borderRadius:   '6px',
    color:          '#ede8e2',
    width:          '44px',
    height:         '44px',
    padding:        0,
    cursor:         'pointer',
    fontSize:       '1rem',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  errorMsg: {
    margin:     '0.5rem 0 0 0',
    fontSize:   '0.8rem',
    color:      'rgba(232,140,140,0.75)',
    fontFamily: 'Inter, sans-serif',
    fontStyle:  'italic',
  },

  // hold
  holdBtn: {
    background:       'rgba(255,255,255,0.04)',
    border:           '1px solid rgba(255,255,255,0.1)',
    borderRadius:     '8px',
    padding:          '0 2.5rem',
    minHeight:        '52px',
    color:            '#c8c0b8',
    fontSize:         '0.78rem',
    letterSpacing:    '0.13em',
    textTransform:    'uppercase',
    cursor:           'pointer',
    userSelect:       'none',
    WebkitUserSelect: 'none',
    fontFamily:       'Inter, sans-serif',
    display:          'flex',
    alignItems:       'center',
    justifyContent:   'center',
  },
  progressTrack: {
    width:        '140px',
    height:       '2px',
    background:   'rgba(255,255,255,0.07)',
    borderRadius: '2px',
    overflow:     'hidden',
  },
  progressFill: {
    height:       '100%',
    background:   'linear-gradient(90deg, rgba(232,121,160,0.7), rgba(212,168,83,0.6))',
    borderRadius: '2px',
    transition:   'width 0.05s linear',
  },

  // heartbeat
  heartContainer: {
    position:       'relative',
    width:          '110px',
    height:         '110px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
  },
  heartBtn: {
    position:         'relative',
    zIndex:           1,
    width:            '72px',
    height:           '72px',
    borderRadius:     '50%',
    background:       'rgba(232,121,160,0.07)',
    border:           '1px solid',
    display:          'flex',
    alignItems:       'center',
    justifyContent:   'center',
    userSelect:       'none',
    WebkitUserSelect: 'none',
    transition:       'border-color 0.4s, box-shadow 0.4s',
  },
  heartSymbol: {
    fontSize:         '1.75rem',
    color:            '#e879a0',
    display:          'block',
    lineHeight:       1,
    userSelect:       'none',
    WebkitUserSelect: 'none',
  },
  heartLabel: {
    margin:        0,
    fontSize:      '0.72rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color:         '#4a4440',
    fontFamily:    'Inter, sans-serif',
  },

  // choice
  choiceList: { display: 'flex', flexDirection: 'column', gap: '0.65rem' },
  choiceBtn: {
    background:    'rgba(255,255,255,0.03)',
    border:        '1px solid',
    borderRadius:  '8px',
    padding:       '0 1.1rem',
    minHeight:     '52px',
    fontSize:      '0.95rem',
    fontFamily:    'Inter, sans-serif',
    cursor:        'pointer',
    textAlign:     'left',
    transition:    'background 0.15s, border-color 0.25s',
    display:       'flex',
    alignItems:    'center',
  },

  // drag
  revealTextWrap: { textAlign: 'center' },
  revealText: {
    fontSize:      '1.5rem',
    fontFamily:    "'Cormorant Garamond', Georgia, serif",
    color:         '#ede8e2',
    letterSpacing: '0.02em',
    display:       'inline-block',
  },
  dragTrack: {
    width:        `${TRACK_W}px`,
    height:       '48px',
    background:   'rgba(255,255,255,0.04)',
    borderRadius: '24px',
    border:       '1px solid rgba(255,255,255,0.1)',
    position:     'relative',
  },
  dragHandle: {
    position:     'absolute',
    top:          `${PADDING}px`,
    left:         `${PADDING}px`,
    width:        `${HANDLE_SZ}px`,
    height:       `${HANDLE_SZ}px`,
    background:   'linear-gradient(135deg, rgba(232,121,160,0.85), rgba(212,168,83,0.65))',
    borderRadius: '50%',
    cursor:       'grab',
    zIndex:       2,
  },
  dragHint: {
    position:      'absolute',
    right:         '12px',
    top:           '50%',
    transform:     'translateY(-50%)',
    fontSize:      '0.67rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color:         'rgba(255,255,255,0.22)',
    fontFamily:    'Inter, sans-serif',
    pointerEvents: 'none',
    whiteSpace:    'nowrap',
  },

  // letter
  letterWrap: {
    position:     'relative',
    width:        '100%',
    maxWidth:     '300px',
    height:       `${LETTER_H}px`,
    borderRadius: '14px',
    overflow:     'hidden',
    border:       '1px solid rgba(212,168,83,0.15)',
  },
  letterBase: {
    position:       'absolute',
    inset:          0,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '1.5rem',
    background:     'linear-gradient(135deg, rgba(212,168,83,0.07) 0%, rgba(180,50,90,0.05) 100%)',
  },
  letterInner: {
    margin:        0,
    fontSize:      '1.05rem',
    fontFamily:    "'Cormorant Garamond', Georgia, serif",
    fontStyle:     'italic',
    color:         '#c8b07a',
    textAlign:     'center',
    lineHeight:    1.75,
    letterSpacing: '0.01em',
  },
  letterSeal: {
    position:             'absolute',
    inset:                0,
    background:           'rgba(13,6,9,0.93)',
    backdropFilter:       'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    display:              'flex',
    flexDirection:        'column',
    alignItems:           'center',
    justifyContent:       'center',
    cursor:               'grab',
    gap:                  '0.55rem',
    touchAction:          'none',
  },
  sealCircle: {
    width:          '38px',
    height:         '38px',
    borderRadius:   '50%',
    border:         '1px solid rgba(212,168,83,0.3)',
    background:     'radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 70%)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
  },
  sealText: {
    margin:        0,
    fontSize:      '0.7rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color:         '#6a5440',
    fontFamily:    'Inter, sans-serif',
  },
  openHint: {
    position:      'absolute',
    bottom:        '14px',
    fontSize:      '0.62rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color:         'rgba(212,168,83,0.28)',
    fontFamily:    'Inter, sans-serif',
    pointerEvents: 'none',
  },

  // tiles
  tilesWrap: {
    width:    '100%',
    maxWidth: '320px',
    display:  'flex',
    flexDirection: 'column',
    gap:      '0.5rem',
  },
  tileOuter: {
    position:     'relative',
    minHeight:    '64px',
    borderRadius: '10px',
    overflow:     'hidden',
    border:       '1px solid rgba(255,255,255,0.07)',
    display:      'flex',
    alignItems:   'center',
    justifyContent: 'center',
    background:   'rgba(255,255,255,0.01)',
  },
  tileText: {
    fontSize:      '1.25rem',
    fontFamily:    "'Cormorant Garamond', Georgia, serif",
    fontStyle:     'italic',
    color:         '#f0ece6',
    letterSpacing: '0.02em',
    zIndex:        0,
    userSelect:    'none',
  },
  tileOverlay: {
    position:             'absolute',
    inset:                0,
    background:           'rgba(255,255,255,0.045)',
    backdropFilter:       'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    zIndex:               1,
  },
  tileHint: {
    margin:        '0.25rem 0 0 0',
    fontSize:      '0.65rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color:         '#3a3632',
    fontFamily:    'Inter, sans-serif',
    textAlign:     'center',
  },
};
