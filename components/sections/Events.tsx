'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Events.module.css';
import EventModal, { type EvolvitEvent } from '../EventModal';
import api from '@/utils/axios';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
type Status = 'upcoming' | 'closed';

function getStatus(event: EvolvitEvent): Status {
  if (event.status === 'upcoming') return 'upcoming';
  return 'closed';
}

function getTechIcon(category: string): React.ReactNode {
  const cat = category.toLowerCase();
  if (cat.includes('hack')) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (cat.includes('idea') || cat.includes('innov')) {
    return <span style={{ fontSize: '0.85rem' }}>⚡</span>;
  }
  if (cat.includes('ai') || cat.includes('ml')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    );
  }
  if (cat.includes('visit') || cat.includes('industry')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (cat.includes('orient')) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }
  return <span style={{ fontSize: '0.85rem' }}>&lt;/&gt;</span>;
}

function getEventCardIcon(event: EvolvitEvent): React.ReactNode {
  const text = `${event.title} ${event.category}`.toLowerCase();
  if (text.includes('hack')) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    );
  }
  if (text.includes('idea')) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" /><path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.74c.62.43 1 1.12 1 1.88V17h6v-.38c0-.76.38-1.45 1-1.88A7 7 0 0 0 12 2Z" />
        <path d="M12 6v4" />
      </svg>
    );
  }
  if (text.includes('ai')) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M7 2v3M12 2v3M17 2v3M7 19v3M12 19v3M17 19v3M2 7h3M2 12h3M2 17h3M19 7h3M19 12h3M19 17h3" />
        <path d="M10 14l1.2-4h1.6l1.2 4M10.5 12.5h3" />
      </svg>
    );
  }
  if (text.includes('visit') || text.includes('industry')) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" />
        <path d="M9 21v-5h6v5" />
        <path d="M9 10h.01M12 10h.01M15 10h.01M9 13h.01M12 13h.01M15 13h.01" />
      </svg>
    );
  }
  if (text.includes('orient')) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
        <path d="M12 12h.01" />
      </svg>
    );
  }
  if (text.includes('art')) {
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a2 2 0 0 1 0-4h1a7 7 0 0 0-2-9Z" />
      </svg>
    );
  }
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 15 9l7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />
    </svg>
  );
}

function CountdownTimer({ targetDate, color }: { targetDate: string; color: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date(targetDate);
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', val: time.days },
    { label: 'HRS', val: time.hours },
    { label: 'MIN', val: time.mins },
    { label: 'SEC', val: time.secs },
  ];

  return (
    <div className={styles.countdown}>
      <span className={styles.countdownLabel} style={{ color }}>⏱ Countdown</span>
      <div className={styles.countdownUnits}>
        {units.map(({ label, val }, i) => (
          <div key={label} className={styles.countdownUnit}>
            <span className={styles.countdownVal} style={{ borderColor: `${color}25` }}>
              {String(val).padStart(2, '0')}
            </span>
            <span className={styles.countdownUnitLabel}>{label}</span>
            {i < units.length - 1 && <span className={styles.countdownSep} style={{ color }}>:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function RegBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className={styles.regBar}>
      <div className={styles.regBarHeader}>
        <span className={styles.regBarLabel}>Registration</span>
        <span className={styles.regBarPct} style={{ color }}>{pct}% filled</span>
      </div>
      <div className={styles.regBarTrack}>
        <div
          className={styles.regBarFill}
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}90, ${color})` }}
        />
      </div>
    </div>
  );
}

function CornerAccent({ color, position }: { color: string; position: 'tl' | 'br' }) {
  const isTL = position === 'tl';
  return (
    <svg
      className={`${styles.cornerAccent} ${isTL ? styles.cornerTL : styles.cornerBR}`}
      width="24" height="24" viewBox="0 0 24 24" fill="none"
    >
      {isTL ? (
        <>
          <path d="M1 12 L1 1 L12 1" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="1" cy="1" r="2" fill={color} fillOpacity="0.8" />
        </>
      ) : (
        <>
          <path d="M23 12 L23 23 L12 23" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="23" cy="23" r="2" fill={color} fillOpacity="0.8" />
        </>
      )}
    </svg>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const config = {
    upcoming: { label: 'Upcoming', cls: styles.badgeUpcoming },
    closed: { label: 'Closed', cls: styles.badgeClosed },
  }[status];
  return <span className={`${styles.statusBadge} ${config.cls}`}>{config.label}</span>;
}

function RippleButton({ color, onClick }: { color: string; onClick?: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = styles.ripple;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    onClick?.();
  };
  return (
    <button
      ref={btnRef}
      className={styles.ctaBtn}
      style={{ background: `linear-gradient(135deg, #7c3aed, ${color})`, boxShadow: `0 4px 24px ${color}40` }}
      onClick={handleClick}
      title="Click to explore event details"
    >
      <span>View Details</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
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
  rawDate: e.date,
});

function EventCard({
  event,
  onSelect,
  isUpcoming = false,
}: {
  event: EvolvitEvent;
  onSelect: (event: EvolvitEvent) => void;
  isUpcoming?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const status = getStatus(event);

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
    if (card) card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    if (glow) glow.style.opacity = '0';
  };

  return (
    <motion.div
      className={styles.cardWrapper}
      variants={cardVariant}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
      style={{ transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div ref={glowRef} className={styles.cardGlow}
        style={{ background: `radial-gradient(circle, ${event.color}60 0%, transparent 70%)`, opacity: 0 }} />
      <div className={styles.cardBorderGlow} />
      <article className={styles.card}>
        <div className={styles.circuitOverlay} />
        <motion.div
          className={styles.cardHighlight}
          style={{ background: `linear-gradient(90deg, transparent, ${event.color}, transparent)` }}
          initial={{ opacity: 0, x: '-100%' }}
          whileHover={{ opacity: 1, x: '100%', transition: { repeat: Infinity, duration: 1.8, ease: 'linear' } }}
        />
        <CornerAccent color={event.color} position="tl" />
        <CornerAccent color={event.color} position="br" />

        <div className={styles.cardTop} style={{ background: `linear-gradient(180deg, ${event.color}08 0%, transparent 100%)` }}>
          <div className={styles.topLeft}>
            <div className={styles.categoryBadge}
              style={{ color: event.color, borderColor: `${event.color}35`, background: `${event.color}10` }}>
              <span className={styles.techIcon} style={{ color: event.color }}>{getTechIcon(event.category)}</span>
              {event.category}
            </div>
            <StatusBadge status={status} />
          </div>
          <div className={styles.emojiContainer}
            style={{ borderColor: `${event.color}20`, boxShadow: `0 0 20px ${event.color}10` }}>
            <span className={styles.emojiInner} style={{ color: event.color }}>{getEventCardIcon(event)}</span>
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
          {isUpcoming && event.rawDate && <CountdownTimer targetDate={event.rawDate} color={event.color} />}
          {isUpcoming && <RegBar pct={34} color={event.color} />}
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.footerDivider}
            style={{ background: `linear-gradient(90deg, transparent, ${event.color}20, transparent)` }} />
          <div className={styles.cardActions}>
            <RippleButton color={event.color} onClick={() => onSelect(event)} />
            {isUpcoming && event.registrationUrl ? (
              <a href={event.registrationUrl} target="_blank" rel="noreferrer"
                className={styles.registerButton}
                onClick={(e) => e.stopPropagation()}
                style={{ color: event.color, borderColor: `${event.color}40`, boxShadow: `0 10px 30px ${event.color}20` }}>
                Register
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export default function Events() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedEvent, setSelectedEvent] = useState<EvolvitEvent | null>(null);
  const [showUpcomingEvents, setShowUpcomingEvents] = useState(false);
  const [pastEvents, setPastEvents] = useState<EvolvitEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EvolvitEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPastEvents(data.filter((e: any) => e.status === 'past').map(mapEvent));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUpcomingEvents(data.filter((e: any) => e.status === 'upcoming').map(mapEvent));
      } catch (err) {
        console.error('Events fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
        Loading events...
      </div>
    );
  }

  return (
    <section id="events" className={styles.events} ref={ref}>
      <div className={styles.gridBg} />
      <div className={styles.noiseOverlay} />
      <div className="container">
        <motion.div className={styles.header}
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="section-label">Future Forward</span>
          <h2 className="section-title"><span className="gradient-text">Upcoming</span> Events</h2>
          <p className="section-subtitle">Register for the next event, then pick from all upcoming opportunities.</p>
        </motion.div>

        {upcomingEvents.length > 0 ? (
          <>
            <div className={styles.upcomingActions}>
              <button type="button" className={styles.primaryRegisterButton}
                onClick={() => setShowUpcomingEvents((prev) => !prev)}>
                {showUpcomingEvents ? 'Hide Upcoming Events' : 'Register for Next Event'}
              </button>
            </div>
            {showUpcomingEvents ? (
              <motion.div className={styles.grid} variants={container} initial="hidden" animate="show"
                style={{ marginBottom: '88px' }}>
                {upcomingEvents.map((event) => (
                  <EventCard key={event.title} event={event} onSelect={setSelectedEvent} isUpcoming />
                ))}
              </motion.div>
            ) : (
              <div className={styles.upcomingHint}>
                <p>Click the button above to view all upcoming events and register for the one you want.</p>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📡</span>
            <p>No upcoming events currently scheduled. Stay tuned!</p>
          </div>
        )}

        <div className={styles.sectionDivider} />

        <motion.div className={styles.header}
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }} style={{ marginTop: '80px' }}>
          <span className="section-label">What We&apos;ve Done</span>
          <h2 className="section-title">Past <span className="gradient-text">Experiences</span></h2>
          <p className="section-subtitle">From hackathons to industrial visits, we create learning experiences that leave a mark.</p>
        </motion.div>

        <motion.div className={styles.grid} variants={container} initial="hidden" animate="show">
          {pastEvents.map((event) => (
            <EventCard key={event.title} event={event} onSelect={setSelectedEvent} />
          ))}
        </motion.div>
      </div>
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
}