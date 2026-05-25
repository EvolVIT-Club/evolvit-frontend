'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContacts, setShowContacts] = useState(false);

  useEffect(() => {
    api.get('/contact').then(({ data }) => setContacts(data));
  }, []);

  const logout = () => {
    document.cookie = 'admin_token=; path=/; max-age=0';
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#fff', fontSize: '1.8rem' }}>EvolVIT Admin</h1>
          <button onClick={logout} style={{
            background: 'transparent', border: '1px solid #444', color: '#aaa',
            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>

        {/* Manage Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Manage Events', path: '/admin/events', color: '#7c3aed' },
            { label: 'Manage Projects', path: '/admin/projects', color: '#3b82f6' },
            { label: 'Manage Testimonials', path: '/admin/testimonials', color: '#f59e0b' },
            { label: 'Site Settings', path: '/admin/settings', color: '#06b6d4' },
          ].map((item) => (
            <div key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                background: '#111', border: `1px solid ${item.color}40`,
                borderRadius: '12px', padding: '32px 24px',
                cursor: 'pointer', textAlign: 'center',
              }}
            >
              <h2 style={{ color: '#fff', fontSize: '1.1rem' }}>{item.label}</h2>
            </div>
          ))}

          {/* Contacts Card */}
          <div
            onClick={() => setShowContacts(!showContacts)}
            style={{
              background: '#111', border: '1px solid #22c55e40',
              borderRadius: '12px', padding: '32px 24px',
              cursor: 'pointer', textAlign: 'center',
            }}
          >
            <h2 style={{ color: '#fff', fontSize: '1.1rem' }}>
              View Contacts
              <span style={{
                marginLeft: '8px', background: '#22c55e20', color: '#22c55e',
                border: '1px solid #22c55e40', borderRadius: '12px',
                padding: '2px 8px', fontSize: '0.8rem'
              }}>
                {contacts.length}
              </span>
            </h2>
          </div>
        </div>

        {/* Contacts List */}
        {showContacts && (
          <div>
            <h2 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.2rem' }}>
              Contact Submissions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contacts.length === 0 ? (
                <p style={{ color: '#555' }}>No contacts yet.</p>
              ) : (
                contacts.map(contact => (
                  <div key={contact._id} style={{
                    background: '#111', border: '1px solid #222',
                    borderRadius: '12px', padding: '20px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{contact.name}</span>
                        <span style={{ color: '#555', fontSize: '0.85rem', marginLeft: '12px' }}>{contact.email}</span>
                      </div>
                      <span style={{ color: '#555', fontSize: '0.8rem' }}>
                        {new Date(contact.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>{contact.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}