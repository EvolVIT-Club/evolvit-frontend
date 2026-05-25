'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import styles from './EventsPreview.module.css';
import EventModal, { type EvolvitEvent } from '../EventModal';
import api from '@/utils/axios';

function getTechIcon(category: string): React.ReactNode {
  const cat = category.toLowerCase();
  if (cat.includes('visit') || cat.includes('industry')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (cat.includes('inaug') || cat.includes('art') || cat.includes('design')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  return <span style={{ fontSize: '0.75rem' }}>&lt;/&gt;</span>;
}

function getEventCardIcon(event: EvolvitEvent): React.ReactNode {
  const text = `${event.title} ${event.category}`.toLowerCase();
  if (text.includes('visit') || text.includes('industry')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" />
        <path d="M9 21v-5h6v5" />
        <path d="M9 10h.01M12 10h.01M15 10h.01M9 13h.01M12 13h.01M15 13h.01" />
      </svg>
    );
  }
  if (text.includes('art') || text.includes('inaug')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a2 2 0 0 1 0-4h1a7 7 0 0 0-2-9Z" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 15 9l7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />
    </svg>
  );
}

function CornerAccent({ color, position }: { color: string; position: 'tl' | 'br' }) {
  const isTL = position === 'tl';
  return (
    <svg className={`${styles.cornerAccent} ${isTL ? styles.cornerTL : styles.cornerBR}`}
      width="20" height="20" viewBox="0 0 24 24" fill="none">
      {isTL ? (
        <>
          <path d="M1 12 L1 1 L12 1" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="1" cy="1" r="2" fill={color} fillOpacity="0.85" />
        </>
      ) : (
        <>
          <path d="M23 12 L23 23 L12 23" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="23" cy="23" r="2" fill={color} fillOpacity="0.85" />
        </>
      )}
    </svg>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 48, filter: 'blur(8px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapEvent = (e: any): EvolvitEvent => ({
  title: e.name,
  date: new Date(e.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  category: e.category || 'Event',
  description: e.description,
  extendedDescription: e.about,
  color: e.color || '#7c3aed',
  emoji: e.emoji || 'EVT',
  images: e.photos || [],
  registrationUrl: e.registrationLink,
  status: e.status,
});

function PreviewCard({ event, onSelect }: { event: EvolvitEvent; onSelect: (e: EvolvitEvent) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -5;
    const ry = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.02)`;
    if (glowRef.current) glowRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    if (glowRef.current) glowRef.current.style.opacity = '0';
  };

  return (
    <motion.div className={styles.cardWrapper} variants={cardVariant} ref={cardRef}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(event)}
      style={{ transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer' }}>
      <div ref={glowRef} className={styles.cardGlow}
        style={{ background: `radial-gradient(circle, ${event.color}55 0%, transparent 70%)`, opacity: 0 }} />
      <div className={styles.cardBorderGlow} />
      <article className={styles.card}>
        <div className={styles.circuitOverlay} />
        <motion.div className={styles.scanLine}
          style={{ background: `linear-gradient(90deg, transparent, ${event.color}, transparent)` }}
          initial={{ opacity: 0, x: '-100%' }}
          whileHover={{ opacity: 1, x: '100%', transition: { repeat: Infinity, duration: 1.8, ease: 'linear' } }} />
        <CornerAccent color={event.color} position="tl" />
        <CornerAccent color={event.color} position="br" />

        <div className={styles.cardTop} style={{ background: `linear-gradient(160deg, ${event.color}0a 0%, transparent 100%)` }}>
          <div className={styles.categoryBadge}
            style={{ color: event.color, borderColor: `${event.color}35`, background: `${event.color}10` }}>
            <span className={styles.techIcon} style={{ color: event.color }}>{getTechIcon(event.category)}</span>
            {event.category}
          </div>
          <div className={styles.emojiContainer}
            style={{ borderColor: `${event.color}20`, boxShadow: `0 0 20px ${event.color}12` }}>
            <span style={{ color: event.color }}>{getEventCardIcon(event)}</span>
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cardDate}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {event.date}
          </div>
          <h3 className={styles.cardTitle}>{event.title}</h3>
          <p className={styles.cardDesc}>{event.description}</p>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.footerDivider}
            style={{ background: `linear-gradient(90deg, transparent, ${event.color}20, transparent)` }} />
          <button className={styles.ctaBtn} style={{
            background: `linear-gradient(135deg, #7c3aed, ${event.color})`,
            boxShadow: `0 4px 20px ${event.color}38`,
          }}>
            <span>Learn more</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </article>
    </motion.div>
  );
}

export default function EventsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedEvent, setSelectedEvent] = useState<EvolvitEvent | null>(null);
  const [events, setEvents] = useState<EvolvitEvent[]>([]);

  useEffect(() => {
    api.get('/events').then(({ data }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const featured = data.filter((e: any) => e.featured).map(mapEvent);
      setEvents(featured);
    });
  }, []);

  return (
    <section className={styles.eventsPreview} ref={ref}>
      <div className={styles.gridBg} />
      <div className={styles.noiseOverlay} />

      <div className="container">
        <motion.div className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}>
          <span className="section-label">What We Do</span>
          <h2 className="section-title">
            Events &amp; <span className="gradient-text">Experiences</span>
          </h2>
          <p className="section-subtitle">
            From hackathons to workshops — we create learning experiences that leave a mark.
          </p>
        </motion.div>

        {events.length > 0 ? (
          <motion.div className={styles.grid} variants={container} initial="hidden" animate="show">
            {events.map((event) => (
              <PreviewCard key={event.title} event={event} onSelect={setSelectedEvent} />
            ))}
          </motion.div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p>No featured events yet — mark events as featured from admin panel!</p>
          </div>
        )}

        <motion.div className={styles.ctaWrap}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}>
          <Link href="/events" className={styles.viewAllBtn}>
            View All Events
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
}