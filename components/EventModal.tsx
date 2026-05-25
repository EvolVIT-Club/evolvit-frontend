'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './EventModal.module.css';

export interface EvolvitEvent {
  title: string;
  date: string;
  category: string;
  description: string;
  extendedDescription?: string;
  color: string;
  emoji: string;
  images?: string[];
  registrationUrl?: string;
  status?: string; 
  rawDate?: string;
}

interface EventModalProps {
  event: EvolvitEvent | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [event]);

  // Handle click outside modal content
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key="event-modal-overlay"
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className={styles.header}>
              <span
                className={styles.category}
                style={{
                  color: event.color,
                  borderColor: `${event.color}40`,
                  background: `${event.color}15`,
                }}
              >
                {event.emoji} {event.category}
              </span>
              <h2 id="modal-title" className={styles.title}>{event.title}</h2>
              <div className={styles.date}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {event.date}
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>About the Event</h3>
              <p className={styles.description}>
                {event.extendedDescription || event.description}
              </p>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Gallery</h3>
              <div className={styles.imageGrid}>
                {/* 
                  When you have real images, replace these placeholders with <Image /> tags.
                  For now, we generate placeholder cards based on the images array length.
                */}
                {event.images && event.images.length > 0 ? (
                  event.images.map((img, idx) => {
                    const imgSrc = img.startsWith('http') ? img : img.startsWith('/') ? img : `/${img}`;
                    return (
                      <div key={idx} className={styles.imageWrapper} onClick={() => setSelectedImage(imgSrc)}>
                        <img
                          src={imgSrc}
                          alt={`${event.title} image ${idx + 1}`}
                          onError={(e) => {
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.style.cursor = 'default';
                              parent.onclick = null;
                              parent.innerHTML = `
                                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--text-secondary); opacity:0.5; font-size: 0.85rem; background: rgba(255,255,255,0.02)">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                  </svg>
                                  <span style="margin-top:8px">Missing File</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <p className={styles.description} style={{ fontStyle: 'italic', opacity: 0.7 }}>
                    No images available yet.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedImage && (
        <motion.div
          key="lightbox-overlay"
          className={styles.fullImageOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Expanded view" className={styles.fullImage} />
          <button className={styles.closeFullButton} onClick={() => setSelectedImage(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
