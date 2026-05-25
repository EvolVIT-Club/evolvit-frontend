'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Initiatives.module.css';

/* ── Data ─────────────────────────────────────────────────────────── */
const initiatives = [
  {
    icon: '🎯',
    title: 'EvolVIT X Datatrack',
    tagline: 'Internship',
    description:
      'A 12-week intensive program where you will learn and work on real-world projects and get mentorship from industry experts.',
    color: '#7c3aed',
    colorAlt: '#a855f7',
    tags: ['12 Weeks', 'Mentorship', 'Real Projects'],
    techIcon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    icon: '🎯',
    title: 'EvolVIT X Quantamard',
    tagline: 'Internship',
    description:
      'A 4-week program where you will work on real-world projects from industry.',
    color: '#3b82f6',
    colorAlt: '#06b6d4',
    tags: ['4 Weeks', 'Industry', 'Hands-on'],
    techIcon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
];

/* ── Corner accent SVG ───────────────────────────────────────────── */
function CornerAccent({ color, position }: { color: string; position: 'tl' | 'br' }) {
  const isTL = position === 'tl';
  return (
    <svg
      className={`${styles.cornerAccent} ${isTL ? styles.cornerTL : styles.cornerBR}`}
      width="22" height="22" viewBox="0 0 24 24" fill="none"
    >
      {isTL ? (
        <>
          <path d="M1 12 L1 1 L12 1" stroke={color} strokeWidth="1.5" strokeOpacity="0.65" />
          <circle cx="1" cy="1" r="2" fill={color} fillOpacity="0.9" />
        </>
      ) : (
        <>
          <path d="M23 12 L23 23 L12 23" stroke={color} strokeWidth="1.5" strokeOpacity="0.65" />
          <circle cx="23" cy="23" r="2" fill={color} fillOpacity="0.9" />
        </>
      )}
    </svg>
  );
}

/* ── Ripple CTA ─────────────────────────────────────────────────── */
function RippleLink({ color, colorAlt }: { color: string; colorAlt: string }) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = styles.ripple;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  };

  return (
    <a
      ref={btnRef}
      href="#"
      className={styles.ctaBtn}
      style={{ background: `linear-gradient(135deg, ${color}, ${colorAlt})`, boxShadow: `0 4px 20px ${color}40` }}
      onClick={handleClick}
    >
      <span>Learn more</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  );
}

/* ── Framer variants ─────────────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 48, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/* ── InitiativeCard ──────────────────────────────────────────────── */
function InitiativeCard({ item }: { item: typeof initiatives[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -5;
    const ry = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.02)`;
    if (glow) glow.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (card) card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    if (glow) glow.style.opacity = '0';
  };

  return (
    <motion.div
      className={styles.cardWrapper}
      variants={cardVariant}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)' }}
    >
      {/* Ambient glow */}
      <div
        ref={glowRef}
        className={styles.cardGlow}
        style={{ background: `radial-gradient(circle, ${item.color}55 0%, transparent 70%)`, opacity: 0 }}
      />

      {/* Spinning gradient border */}
      <div className={styles.cardBorderGlow}>
        <div
          className={styles.cardBorderSpinner}
          style={{ background: `conic-gradient(from 0deg, ${item.color}, ${item.colorAlt}, #ec4899, ${item.color})` }}
        />
      </div>

      <article className={styles.card}>
        {/* Circuit overlay */}
        <div className={styles.circuitOverlay} />

        {/* Scanning line */}
        <motion.div
          className={styles.scanLine}
          style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
          initial={{ opacity: 0, x: '-100%' }}
          whileHover={{ opacity: 1, x: '100%', transition: { repeat: Infinity, duration: 2, ease: 'linear' } }}
        />

        {/* Corner accents */}
        <CornerAccent color={item.color} position="tl" />
        <CornerAccent color={item.color} position="br" />

        {/* ── Card Top ── */}
        <div className={styles.cardTop} style={{ background: `linear-gradient(160deg, ${item.color}0a 0%, transparent 100%)` }}>
          <div className={styles.topLeft}>
            {/* Category badge */}
            <div
              className={styles.categoryBadge}
              style={{ color: item.color, borderColor: `${item.color}35`, background: `${item.color}10` }}
            >
              <span className={styles.techIcon} style={{ color: item.color }}>{item.techIcon}</span>
              {item.tagline}
            </div>
          </div>

          {/* Emoji icon */}
          <div
            className={styles.emojiContainer}
            style={{ borderColor: `${item.color}25`, boxShadow: `0 0 24px ${item.color}12` }}
          >
            <span className={styles.emojiInner}>{item.icon}</span>
          </div>
        </div>

        {/* ── Card Body ── */}
        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <p className={styles.cardDesc}>{item.description}</p>

          {/* Skill tags */}
          <div className={styles.tagRow}>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={styles.tag}
                style={{ color: item.colorAlt, borderColor: `${item.colorAlt}28`, background: `${item.colorAlt}0c` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Card Footer ── */}
        <div className={styles.cardFooter}>
          <div
            className={styles.footerDivider}
            style={{ background: `linear-gradient(90deg, transparent, ${item.color}22, transparent)` }}
          />
          <RippleLink color={item.color} colorAlt={item.colorAlt} />
        </div>
      </article>
    </motion.div>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */
export default function Initiatives() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="initiatives" className={styles.initiatives} ref={ref}>
      {/* Background decorations */}
      <div className={styles.gridBg} />
      <div className={styles.noiseOverlay} />

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">Programs</span>
          <h2 className="section-title">
            Our <span className="gradient-text">Initiatives</span>
          </h2>
          <p className="section-subtitle">
            Structured programs designed to accelerate your growth as a developer.
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {initiatives.map((item) => (
            <InitiativeCard key={item.title} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
