'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import styles from './Hero.module.css';
import api from '@/utils/axios';

export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [stats, setStats] = useState({ members: 35, events: 3, projects: 4 });

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      setStats({
        members: data.members,
        events: data.events,
        projects: data.projects,
      });
    });
  }, []);

  return (
    <section className={styles.hero} ref={ref}>
      <motion.div
        className={`${styles.orb} ${styles.orbPrimary}`}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`${styles.orb} ${styles.orbSecondary}`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className={`${styles.orb} ${styles.orbTertiary}`}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      <div className={styles.grid} />

      <div className={`container ${styles.content}`}>
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className={styles.badgeDot} />
          Student Tech Community · VIT
        </motion.div>

        <motion.h1
          className={styles.heading}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Evolving Ideas
          <br />
          <span className={styles.gradientText}>into Innovation</span>
        </motion.h1>

        <motion.p
          className={styles.subtext}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          EvolVIT is a student-driven tech community focused on bridge the gap between students and the tech industry by providing the real-world exposure and hands-on experience.
        </motion.p>

        <motion.div
          className={styles.ctaGroup}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Link href="/contact" className={`${styles.ctaPrimary}`}>
            <span>Join Community</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/events" className={`${styles.ctaSecondary}`}>
            Learn more
          </Link>
        </motion.div>

        <motion.div
          className={styles.floatingCard}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className={styles.floatingCardInner}>
            <div className={styles.floatingStats}>
              <div className={styles.floatStat}>
                <span className={styles.floatNum}>{stats.members}+</span>
                <span className={styles.floatLabel}>Members</span>
              </div>
              <div className={styles.floatDivider} />
              <div className={styles.floatStat}>
                <span className={styles.floatNum}>{stats.events}+</span>
                <span className={styles.floatLabel}>Events</span>
              </div>
              <div className={styles.floatDivider} />
              <div className={styles.floatStat}>
                <span className={styles.floatNum}>{stats.projects}+</span>
                <span className={styles.floatLabel}>Projects</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className={styles.scrollDot}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  );
}