import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const INITIAL_DELAY_MS   = 400;
const POST_COMPLETE_DELAY = 500;

// Per-pacing intervals: [standard, long (>44 chars)]
const PACING = {
  normal: [920,  1100],
  slow:   [1300, 1550],  // Ch4 — lines land with full weight
};

function getInterval(line, pacing = 'normal') {
  const [std, long] = PACING[pacing] ?? PACING.normal;
  return line && line.length > 44 ? long : std;
}

const lineVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function AnimatedText({ lines, onComplete, pacing = 'normal' }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const timerRef      = useRef(null);

  useEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    if (visibleCount >= lines.length) {
      timerRef.current = setTimeout(() => onCompleteRef.current?.(), POST_COMPLETE_DELAY);
      return () => clearTimeout(timerRef.current);
    }
    const prevLine = lines[visibleCount - 1];
    const delay    = visibleCount === 0 ? INITIAL_DELAY_MS : getInterval(prevLine, pacing);
    timerRef.current = setTimeout(() => setVisibleCount(c => c + 1), delay);
    return () => clearTimeout(timerRef.current);
  }, [visibleCount, lines.length, pacing]);

  // Tap anywhere on the lines area to skip ahead one line immediately.
  const handleTap = useCallback(() => {
    clearTimeout(timerRef.current);
    if (visibleCount >= lines.length) {
      onCompleteRef.current?.();
    } else {
      setVisibleCount(c => c + 1);
    }
  }, [visibleCount, lines.length]);

  return (
    <div style={styles.container} onClick={handleTap} role="presentation">
      {lines.slice(0, visibleCount).map((line, i) => (
        <motion.p
          key={i}
          style={styles.line}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '1.25rem',
    cursor:        'default',
  },
  line: {
    margin:        0,
    fontSize:      '1.2rem',
    lineHeight:    1.78,
    color:         '#ede8e2',
    fontFamily:    "'Cormorant Garamond', Georgia, serif",
    fontWeight:    400,
    letterSpacing: '0.01em',
  },
};
