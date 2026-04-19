import pinkSareeImg from '../assets/images/pink-saree.webp';
import kajuKatliImg from '../assets/images/kaju-katli.webp';
import usMomentImg  from '../assets/images/us-moment.webp';
import airportImg   from '../assets/images/airport-reunion.webp';

/**
 * All 7 chapters of the anniversary experience.
 *
 * interaction types:
 *   tap        — single press to acknowledge and continue
 *   hold       — hold to stay in a feeling (progress bar)
 *   heartbeat  — hold a beating heart to continue
 *   drag       — drag to unblur a reveal
 *   choice     — pick one; allCorrect: true = any answer proceeds
 *   letter     — slide open a sealed letter to reveal a line
 *   tiles      — tap frosted panels to reveal a phrase piece by piece
 *
 * image (optional):
 *   src         — imported image URL
 *   revealStyle — 'blur' | 'slow-blur' | 'fade'
 *
 * screenBg — per-chapter atmospheric gradient (array, joined with ', ')
 *   Each chapter has a distinct visual atmosphere that matches its emotional tone.
 *
 * memoryDelay (optional) — ms before the gate appears after the memory card.
 *   Default: 1200ms.
 *
 * linePacing (optional) — 'normal' (default) | 'slow'
 *   'slow' increases time between lines to 1300ms/1550ms.
 *
 * theme (optional) — 'warm' (default) | 'cold'
 *   'cold' desaturates the memory card accent to grey-violet (Ch4).
 */

const chapters = [
  {
    id: 1,
    title: "The Unexpected Beginning",
    lines: [
      "It started with a follow request.",
      "Not a grand gesture. Not a conversation opener.",
      "Just a small, quiet signal — I see you.",
      "You accepted.",
      "That was enough to change everything.",
    ],
    memory:
      "An Instagram request. That's all it took. Most love stories begin with something that small.",
    memoryDelay: 1400,
    // Gentle pink at bottom-right — quiet, an invitation, a beginning
    screenBg: [
      'radial-gradient(ellipse 65% 50% at 80% 92%, rgba(180,50,90,0.16) 0%, transparent 55%)',
      'radial-gradient(ellipse 45% 35% at 12% 8%,  rgba(212,168,83,0.07) 0%, transparent 50%)',
      '#0e0709',
    ],
    interaction: {
      type: "tap",
      label: "I remember",
    },
  },

  {
    id: 2,
    title: "First Glimpse, First Madness",
    lines: [
      "Then I saw you in that pink saree.",
      "And something in my head just — stopped working correctly.",
      "I kept finding reasons to look again.",
      "I told myself it was nothing. I was obviously lying.",
    ],
    memory:
      "The pink saree. I don't think you knew what you were doing to me. Actually, I think you did.",
    image: {
      src:            pinkSareeImg,
      revealStyle:    'blur',
      objectPosition: '50% 20%',
    },
    // The blur on pink-saree.webp takes ~2.4s to fully resolve (920ms trigger + 1500ms transition).
    // memoryDelay matches that so the tap gate appears when the image is sharp, not while it's hazy.
    memoryDelay: 2400,
    // Strong pink bloom — disorientation, the mind going offline
    screenBg: [
      'radial-gradient(ellipse 88% 62% at 18% 8%,  rgba(200,65,105,0.24) 0%, transparent 54%)',
      'radial-gradient(ellipse 55% 42% at 88% 88%, rgba(212,168,83,0.09) 0%, transparent 48%)',
      '#0e0709',
    ],
    interaction: {
      type: "tap",
      label: "I couldn't look away",
    },
  },

  {
    id: 3,
    title: "Loving You Even When I Couldn't Have You",
    lines: [
      "You weren't mine. I knew that.",
      "I showed up anyway — as a friend, as whatever you needed.",
      "And then one day you arrived with kaju katli.",
      "No occasion. No explanation. Just — here.",
    ],
    memory:
      "You brought me kaju katli out of nowhere. In the middle of everything complicated between us, that one small thing quietly undid me.",
    image: {
      src:         kajuKatliImg,
      revealStyle: 'fade',
    },
    memoryDelay: 2000,
    // Intense rose + barely-there violet — longing, bittersweet ache
    screenBg: [
      'radial-gradient(ellipse 88% 65% at 10% 6%, rgba(180,50,90,0.28) 0%, transparent 56%)',
      'radial-gradient(ellipse 52% 42% at 88% 80%, rgba(100,75,150,0.10) 0%, transparent 50%)',
      '#0d0608',
    ],
    interaction: {
      type: "heartbeat",
      label: "Hold on to this",
      durationMs: 2800,
    },
  },

  {
    id: 4,
    title: "The Darkest Phase",
    lines: [
      "I pulled back. You felt it.",
      "There was a version of this where we just — faded.",
      "I was tired of wanting something I couldn't say out loud.",
      "The distance between us had a shape.",
    ],
    memory:
      "The silence that wasn't comfortable anymore. Both of us pretending not to notice what was fraying.",
    memoryDelay: 1600,
    linePacing:  'slow',
    theme:       'cold',
    // No warmth — the near-absence of colour IS the atmosphere
    screenBg: [
      'radial-gradient(ellipse 95% 75% at 50% 48%, rgba(18,14,22,0.85) 0%, transparent 65%)',
      'radial-gradient(ellipse 55% 40% at 20% 15%, rgba(50,45,65,0.08) 0%, transparent 50%)',
      '#090608',
    ],
    interaction: {
      type: "choice",
      prompt: "Why didn't it just end?",
      options: ["Stubbornness", "Something we couldn't name", "We weren't done yet"],
      allCorrect: true,
    },
  },

  {
    id: 5,
    title: "The Turning Point",
    lines: [
      "On 3 February, I said it first.",
      "With no guarantee it was going the same direction.",
      "Fifteen days of not knowing.",
      "I didn't call. I didn't text. I waited.",
      "Then — 18 February. You said it back.",
    ],
    memory:
      "I told you I loved you and then waited fifteen days to find out if it was mutual. Those were the longest fifteen days.",
    memoryDelay: 1600,
    // Cold violet at top (the not-knowing) → warm pink at bottom-right (the answer)
    // The gradient mirrors the chapter's emotional arc read top-to-bottom
    screenBg: [
      'radial-gradient(ellipse 72% 52% at 50% 0%,  rgba(80,65,110,0.15) 0%, transparent 55%)',
      'radial-gradient(ellipse 62% 48% at 88% 98%, rgba(232,121,160,0.22) 0%, transparent 52%)',
      '#0e0709',
    ],
    interaction: {
      type: "drag",
      label: "Uncover what you said back",
      revealText: "I love you too.",
    },
  },

  {
    id: 6,
    title: "Us Beyond Everything",
    lines: [
      "20 April was the day it became real in a different way.",
      "Ferre. That night. The moment we stopped being almost.",
      "You've seen me unfinished — and stayed anyway.",
      "I don't take that lightly. I never will.",
    ],
    memory:
      "20 April. The commitment that didn't need explaining — we both knew exactly what it meant.",
    image: {
      src:         usMomentImg,
      revealStyle: 'fade',
    },
    memoryDelay: 1800,
    // Warm and gold-touched — the celebratory chapter
    screenBg: [
      'radial-gradient(ellipse 78% 58% at 14% 8%,  rgba(180,50,90,0.20) 0%, transparent 52%)',
      'radial-gradient(ellipse 68% 52% at 90% 88%, rgba(212,168,83,0.15) 0%, transparent 50%)',
      '#0e0709',
    ],
    interaction: {
      type: "letter",
      sealText: "for you, always",
      revealText: "Everything I am, I became with you beside me.",
    },
  },

  {
    id: 7,
    title: "Distance, But Never Apart",
    lines: [
      "I moved to Germany.",
      "And I learned that missing someone can feel like a full-time occupation.",
      "But every call, every time zone calculation, every waited-for message —",
      "None of it felt like loss. It felt like proof.",
    ],
    memory:
      "The reunion at the airport. I'd been holding it together for weeks. Then I saw you — and I didn't have to anymore.",
    image: {
      src:         airportImg,
      revealStyle: 'slow-blur',
    },
    memoryDelay: 1600,
    ending:      true,   // after interaction: zoom/dim the screen → go directly to FinalReveal
    // Warm at the edges but muted — distance dulls everything, yet love persists
    screenBg: [
      'radial-gradient(ellipse 72% 52% at 14% 8%,  rgba(180,50,90,0.15) 0%, transparent 50%)',
      'radial-gradient(ellipse 55% 42% at 86% 90%, rgba(212,168,83,0.09) 0%, transparent 48%)',
      '#0e0709',
    ],
    interaction: {
      type: "tiles",
      tiles: ["Still here.", "Still yours.", "Always."],
    },
  },
];

export default chapters;
