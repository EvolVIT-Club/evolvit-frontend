'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import styles from './Testimonials.module.css';
import api from '@/utils/axios';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  message: string;
  avatar?: string;
}

const COLORS = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#3b82f6'];

function CornerAccent({ color, position }: { color: string; position: 'tl' | 'tr' | 'bl' | 'br' }) {
  let classes = styles.cornerAccent;
  if (position === 'tl') classes += ` ${styles.cornerTL}`;
  if (position === 'tr') classes += ` ${styles.cornerTR}`;
  if (position === 'bl') classes += ` ${styles.cornerBL}`;
  if (position === 'br') classes += ` ${styles.cornerBR}`;

  const isTop = position.includes('t');
  const isLeft = position.includes('l');
  const cx = isLeft ? 1 : 23;
  const cy = isTop ? 1 : 23;
  const pathD = isTop
    ? isLeft ? "M1 12 L1 1 L12 1" : "M23 12 L23 1 L12 1"
    : isLeft ? "M1 12 L1 23 L12 23" : "M23 12 L23 23 L12 23";

  return (
    <svg className={classes} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d={pathD} stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
      <circle cx={cx} cy={cy} r="2" fill={color} fillOpacity="0.85" />
    </svg>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    api.get('/testimonials').then(({ data }) => setTestimonials(data));
  }, []);

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  if (testimonials.length === 0) return (
  <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
    Loading...
  </div>
);

  const t = testimonials[active];
  const color = COLORS[active % COLORS.length];

  return (
    <section id="testimonials" className={styles.testimonials} ref={ref}>
      <div className={styles.gridBg} />
      <div className={styles.noiseOverlay} />
      <div className={styles.bgGlow} />

      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}  // inView condition hata do
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">Voices</span>
          <h2 className="section-title">
            What Our <span className="gradient-text">Members Say</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.sliderWrap}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}  // inView condition hata do
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className={styles.cardWrapper}
              initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.cardGlow} style={{ background: `radial-gradient(ellipse, ${color}40, transparent 70%)` }} />
              <div className={styles.cardBorderGlow} />

              <div className={styles.quote}>
                <div className={styles.circuitOverlay} />
                <CornerAccent color={color} position="tl" />
                <CornerAccent color={color} position="tr" />
                <CornerAccent color={color} position="bl" />
                <CornerAccent color={color} position="br" />

                <div className={styles.quoteIcon} style={{ color }}>&ldquo;</div>
                <p className={styles.quoteText}>{t.message}</p>

                <div className={styles.author}>
                  <div className={styles.authorAvatar} style={{ 
  background: t.avatar?.startsWith('http') ? 'transparent' : `linear-gradient(135deg, ${color}, ${color}99)`,
  boxShadow: `0 4px 12px ${color}66`,
  overflow: 'hidden',
  padding: 0,
}}>
  {t.avatar?.startsWith('http') ? (
    <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  ) : (
    t.avatar || t.name[0]
  )}
</div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{t.name}</span>
                    <span className={styles.authorRole}>{t.role}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className={styles.controls}>
            <div className={styles.dots}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={i === active ? { background: `linear-gradient(90deg, ${color}, ${color}99)` } : {}}
                />
              ))}
            </div>
            <div className={styles.arrows}>
              <button className={styles.arrow} onClick={prev} aria-label="Previous">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button className={styles.arrow} onClick={next} aria-label="Next">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}