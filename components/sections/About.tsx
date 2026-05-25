'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './About.module.css';

const features = [
  {
    icon: '🚀',
    title: 'Innovation',
    description: 'We push technology boundaries and explore cutting-edge domains from AI to Web3.',
    color: '#7c3aed',
  },
  {
    icon: '🤝',
    title: 'Collaboration',
    description: 'A community where diverse minds come together to solve real-world problems.',
    color: '#06b6d4',
  },
  {
    icon: '📚',
    title: 'Learning',
    description: 'Continuous growth through workshops, mentorship, and hands-on experience.',
    color: '#a855f7',
  },
  {
    icon: '⚡',
    title: 'Real Projects',
    description: 'We ship real-world solutions that make a difference — not just theory.',
    color: '#3b82f6',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ── Corner Accent ───────────────────────────────────────────────── */
function CornerAccent({ color, position }: { color: string; position: 'tl' | 'tr' | 'bl' | 'br' }) {
  let classes = styles.cornerAccent;
  if (position === 'tl') classes += ` ${styles.cornerTL}`;
  if (position === 'tr') classes += ` ${styles.cornerTR}`;
  if (position === 'bl') classes += ` ${styles.cornerBL}`;
  if (position === 'br') classes += ` ${styles.cornerBR}`;

  const isTop = position.includes('t');
  const isLeft = position.includes('l');
  
  const cx = isLeft ? 1 : 15;
  const cy = isTop ? 1 : 15;

  const pathD = isTop
    ? isLeft ? "M1 8 L1 1 L8 1" : "M15 8 L15 1 L8 1"
    : isLeft ? "M1 8 L1 15 L8 15" : "M15 8 L15 15 L8 15";

  return (
    <svg className={classes} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d={pathD} stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
      <circle cx={cx} cy={cy} r="1.5" fill={color} fillOpacity="0.85" />
    </svg>
  );
}

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  };

  return (
    <motion.div
      className={styles.cardWrapper}
      variants={item}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div className={styles.cardGlow} style={{ background: `radial-gradient(circle, ${feature.color}40, transparent 70%)` }} />
      <div className={styles.cardBorderGlow} />

      <div className={styles.featureCard}>
        <div className={styles.circuitOverlay} />
        
        <CornerAccent color={feature.color} position="tl" />
        <CornerAccent color={feature.color} position="br" />

        <div className={styles.iconWrapper} style={{ color: feature.color, background: `${feature.color}15`, borderColor: `${feature.color}30` }}>
          <span className={styles.cardIcon}>{feature.icon}</span>
        </div>
        <h3 className={styles.cardTitle}>{feature.title}</h3>
        <p className={styles.cardDesc}>{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className={styles.about} ref={ref}>
      <div className={styles.gridBg} />
      <div className={styles.noiseOverlay} />

      <div className="container">
        <div className={styles.grid}>
          {/* Left Column */}
          <motion.div
            className={styles.leftCol}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-label">Who We Are</span>
            <h2 className="section-title">
              More Than a Club —<br />
              <span className="gradient-text">A Movement</span>
            </h2>
            <div className={styles.contentCard}>
              <div className={styles.circuitOverlay} />
              <div className={styles.accentLine} />
              <p className={styles.description}>
                EvolVIT was born from a simple idea: To cultivate a community of innovative problem-solvers who are well-equipped to tackle complex, real-world challenges in the technology sector. We&apos;re not
                about certificates — we&apos;re about creation.
              </p>
              <p className={styles.description} style={{ marginTop: 16 }}>
                To provide a unique, hands-on learning environment by sourcing and presenting industry-specific problem statements to students, thereby enabling them to gain practical experience, build a professional portfolio, and secure future career opportunities — EvolVIT is where engineers, designers, and
                thinkers evolve.
              </p>
            </div>
            
            <div className={styles.pillGroup}>
              {['AI & ML', 'Web Dev', 'Real-World problem Solving', 'Hackathons'].map((p) => (
                <span key={p} className={styles.techPill}>{p}</span>
              ))}
            </div>
          </motion.div>

          {/* Right Column — Cards */}
          <motion.div
            className={styles.cardGrid}
            variants={container}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            {features.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
