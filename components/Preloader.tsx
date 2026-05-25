'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Preloader.module.css';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep scrolling disabled while loading
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = '';
    }, 3800); // Updated to accommodate the longer 2.0s delays

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className={styles.preloader}
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%', filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Ambient Background Glow */}
          <div className={styles.bgGlow} />
          
          <div className={styles.container}>
            {/* Original Logo Animation */}
            <motion.img
              src="/logo.png"
              alt="EvolVIT Logo"
              style={{ width: '140px', height: 'auto', display: 'block' }}
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
            />
            
            {/* Text Reveal */}
            <div className={styles.textContainer}>
              <motion.div
                className={styles.text}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.6, ease: 'easeOut' }}
              >
                <span className={styles.logoText}>Evol</span>
                <span className={styles.logoTextGradient}>VIT</span>
              </motion.div>
              
              {/* Animated scanning bar under text */}
              <motion.div 
                className={styles.scanBar}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 2.0, duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
