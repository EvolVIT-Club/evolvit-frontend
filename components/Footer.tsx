'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './Footer.module.css';

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Community: [
    { label: 'About Us', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Events', href: '/events' },
    { label: 'Projects', href: '/projects' },
  ],
  Initiatives: [
    { label: 'EvolVIT X DataTrack', href: '/projects' },
    { label: 'EvolVIT X Quantamard', href: '/projects' },
  ],
  Connect: [
    { label: 'Instagram', href: 'https://www.instagram.com/evolvitclub_vitb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/evolvit-club/' },
    { label: 'GitHub', href: 'https://github.com/EvolVIT-VIT' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Background ambient glow */}
      <div className={styles.bgGlow} />

      <div className={styles.top}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <Link href="/" className={styles.logo}>
                <span className={styles.logoIcon}>
                  <img src="/logo.png" alt="Logo" style={{ height: '100px', width: 'auto', display: 'block', marginLeft: '-12px' }} />
                </span>
                <span className={styles.logoText}>EvolVIT</span>
              </Link>
              <p className={styles.tagline}>
                A student-driven tech community evolving ideas into innovation.
              </p>
              <div className={styles.socials}>
                {[
                  { href: 'https://www.instagram.com/evolvit.vit/', icon: '📸', label: 'Instagram' },
                  { href: 'https://www.linkedin.com/company/evolvit-vit/', icon: '💼', label: 'LinkedIn' },
                  { href: 'https://github.com/EvolVIT-VIT', icon: '🐙', label: 'GitHub' },
                ].map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    className={styles.socialIcon}
                    title={s.label}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className={styles.linkGroup}>
                <h4 className={styles.linkGroupTitle}>
                  <span className={styles.titleGradient}>{category}</span>
                </h4>
                <ul className={styles.linkList}>
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                        <span className={styles.linkHoverLine} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {year} EvolVIT. Built with <span className={styles.heart}>❤️</span> by students, for students.
            </p>
            <div className={styles.legal}>
              <a href="#">Privacy Policy</a>
              <span className={styles.dot}>·</span>
              <a href="#">Terms of Use</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
