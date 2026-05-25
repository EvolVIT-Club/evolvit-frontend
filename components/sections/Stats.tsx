'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Stats.module.css';
import api from '@/utils/axios';

const COLORS = ['#7c3aed', '#06b6d4', '#a855f7', '#3b82f6'];

const STAT_META = [
  { key: 'members', label: 'Active Members', desc: 'Students engaged across domains' },
  { key: 'events', label: 'Events Conducted', desc: 'Workshops, talks & hackathons' },
  { key: 'projects', label: 'Projects Built', desc: 'Real products shipped to production' },
  { key: 'partners', label: 'Industry Partners', desc: 'Companies we collaborate with' },
];

function useCountUp(target: number, duration: number, active: boolean): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);

  return count;
}

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

function StatCard({ value, label, desc, color, index, active }: {
  value: number; label: string; desc: string; color: string; index: number; active: boolean;
}) {
  const count = useCountUp(value, 1800, active);
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
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      animate={active ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div className={styles.cardGlow} style={{ background: `radial-gradient(circle, ${color}40, transparent 70%)` }} />
      <div className={styles.cardBorderGlow} />
      <div className={styles.statCard}>
        <div className={styles.circuitOverlay} />
        <CornerAccent color={color} position="tl" />
        <CornerAccent color={color} position="br" />
        <div className={styles.statNumber} style={{ background: `linear-gradient(135deg, ${color}, #fff)` }}>
          {count}
          <span className={styles.suffix}>+</span>
        </div>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statDesc}>{desc}</div>
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [settings, setSettings] = useState({ members: 0, events: 0, projects: 0, partners: 0 });

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data));
  }, []);

  return (
    <section id="stats" className={styles.stats} ref={ref}>
      <div className={styles.gridBg} />
      <div className={styles.noiseOverlay} />
      <div className={styles.bgGlow} />

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">Impact</span>
          <h2 className="section-title">
            Numbers That <span className="gradient-text">Speak</span>
          </h2>
        </motion.div>

        <div className={styles.grid}>
          {STAT_META.map((meta, i) => (
            <StatCard
              key={meta.key}
              value={settings[meta.key as keyof typeof settings]}
              label={meta.label}
              desc={meta.desc}
              color={COLORS[i]}
              index={i}
              active={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}