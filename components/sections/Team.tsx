'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Team.module.css';

/* ── Data ─────────────────────────────────────────────────────────── */
const team = [
  { name: 'Ayush Karan', role: 'President', emoji: '👨‍💻', image: '/team/ayush.jpeg', Instagram: '#', linkedin: 'http://www.linkedin.com/in/ayush-karan', github: 'https://github.com/Ayush07571' },
  { name: 'Parth Gholap', role: 'President', emoji: '👨‍💻', image: '/team/parth.jpg', Instagram: '#', linkedin: 'https://www.linkedin.com/in/parth-gholap-474696325?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: 'https://github.com/Parth-Gholap' },
  { name: 'Ashish Raj', role: 'General Secretary', emoji: '👩‍🔬', image: '/team/ashish.jpg', Instagram: '#', linkedin: 'https://www.linkedin.com/in/ashish-raj-504760319?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', github: 'https://github.com/AshishRaj1901' },
  { name: 'Abhiral Jain', role: 'Lead — Research and Dev', emoji: '👩‍🔬', image: '/team/abhiral.jpeg', Instagram: 'https://www.instagram.com/abhirallll___/', linkedin: 'https://www.linkedin.com/in/jainabhiral/', github: 'https://github.com/AbhiralJain07' },
  { name: 'Rishi Dewangan', role: 'Lead — Technical', emoji: '🌐', image: '/team/rishi.jpeg', Instagram: 'https://www.instagram.com/rishidewangan493?igsh=Z21yc2xicjFpcGw0', linkedin: 'https://www.linkedin.com/in/rishi-dewangan-871399311/', github: 'https://github.com/rixhi-dwang' },
  { name: 'Manasvi Kirkire', role: 'Lead — Design', emoji: '🎨', image: '/team/manasvi.jpg', Instagram: '#', linkedin: 'https://www.linkedin.com/in/manasvi-kirkire-7240a4324?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: 'https://github.com/manasvi07kirkire' },
  { name: 'Vaishnavi Singh', role: 'Lead — Media', emoji: '📷', image: '/team/vaishnavi.jpg', Instagram: 'https://www.instagram.com/vaish_x_singh?utm_source=qr&igsh=bGk5cXY4MWpweHNs', linkedin: 'https://www.linkedin.com/in/vaishnavi-singh-0a0709340?trk=contact-info', github: 'https://github.com/Vaishnavi2329' },
  { name: 'Om Patel', role: 'Lead — Photography', emoji: '📸', image: '/team/om.jpeg', Instagram: 'https://www.instagram.com/ompatell_05?igsh=azJxcm1jNmEzMmdj', linkedin: 'https://www.linkedin.com/in/ompatel0511?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', github: 'https://github.com/Om5-patel' },
];

const faculty = [
  { name: 'NB Prakash', role: 'Faculty Coordinator', emoji: '👨‍🏫', image: '/team/nb_prakash.jpeg', linkedin: 'https://in.linkedin.com/in/dr-prakash-nattanmai-balasubramanian-03218033' },
];

/* ── Colors ──────────────────────────────────────────────────────── */
const gradients = [
  'linear-gradient(135deg, #7c3aed, #a855f7)',
  'linear-gradient(135deg, #3b82f6, #7c3aed)',
  'linear-gradient(135deg, #a855f7, #ec4899)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #059669, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #ec4899, #f59e0b)',
  'linear-gradient(135deg, #7c3aed, #06b6d4)',
];

const hexColors = ['#7c3aed', '#3b82f6', '#a855f7', '#06b6d4', '#059669', '#f59e0b', '#ec4899', '#7c3aed'];

/* ── Corner Accent ───────────────────────────────────────────────── */
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

/* ── MemberCard Component ────────────────────────────────────────── */
function MemberCard({ member, index, inView }: { member: any; index: number; inView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const gradient = gradients[index % gradients.length];
  const baseColor = hexColors[index % hexColors.length];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
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
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
      style={{ transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Ambient glow */}
      <div className={styles.cardGlow} style={{ background: `radial-gradient(circle, ${baseColor}55, transparent 70%)` }} />

      {/* Spinning gradient border */}
      <div className={styles.cardBorderGlow} />

      <div className={styles.card}>
        {/* Tech Circuit Overlay */}
        <div className={styles.circuitOverlay} />

        {/* Corner Accents */}
        <CornerAccent color={baseColor} position="tl" />
        <CornerAccent color={baseColor} position="br" />

        {/* Top Scan Line */}
        <motion.div
          className={styles.scanLine}
          style={{ background: `linear-gradient(90deg, transparent, ${baseColor}, transparent)` }}
          initial={{ opacity: 0, x: '-100%' }}
          whileHover={{ opacity: 1, x: '100%', transition: { repeat: Infinity, duration: 1.5, ease: 'linear' } }}
        />

        {/* Avatar */}
        <div className={styles.avatarWrap}>
          {/* Glow ring */}
          <div className={styles.avatarRing} style={{ background: gradient }} />

          <div className={styles.avatar} style={{ background: gradient }}>
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className={styles.avatarImage}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <span className={styles.avatarEmoji} style={member.image ? { display: 'none' } : undefined}>{member.emoji}</span>
          </div>
        </div>

        <div className={styles.info}>
          <h3 className={styles.name}>{member.name}</h3>
          <div className={styles.roleBadge} style={{ color: baseColor, background: `${baseColor}15`, borderColor: `${baseColor}30` }}>
            {member.role}
          </div>

          <div className={styles.socialRow}>
            {member.twitter && (
              <a href={member.twitter} className={styles.socialIcon} title="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
            {member.Instagram && (
              <a href={member.Instagram} className={styles.socialIcon} title="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} className={styles.socialIcon} title="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            )}
            {member.github && (
              <a href={member.github} className={styles.socialIcon} title="GitHub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section Component ───────────────────────────────────────────── */
export default function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="team" className={styles.team} ref={ref}>
      {/* Background decorations */}
      <div className={styles.gridBg} />
      <div className={styles.noiseOverlay} />

      <div className="container">
        {/* Main Team Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">The People</span>
          <h2 className="section-title">
            Meet the <span className="gradient-text">Team</span>
          </h2>
          <p className="section-subtitle">
            The passionate minds behind EvolVIT who make it all happen.
          </p>
        </motion.div>

        {/* Main Team Grid */}
        <div className={styles.grid}>
          {team.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} inView={inView} />
          ))}
        </div>

        {/* Divider */}
        <div className="section-divider" style={{ margin: '100px 0' }} />

        {/* Faculty Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="section-title">
            Faculty <span className="gradient-text">Coordinators</span>
          </h2>
          <p className="section-subtitle">
            Guiding EvolVIT towards unparalleled success.
          </p>
        </motion.div>

        {/* Faculty Grid */}
        <div className={styles.facultyGrid}>
          {faculty.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} inView={true} />
          ))}
        </div>
      </div>
    </section>
  );
}
