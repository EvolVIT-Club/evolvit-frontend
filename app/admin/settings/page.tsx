'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

export default function AdminSettings() {
  const router = useRouter();
  const [form, setForm] = useState({ members: 0, events: 0, projects: 0, partners: 0 });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setForm({
      members: data.members,
      events: data.events,
      projects: data.projects,
      partners: data.partners,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/settings', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: '#1a1a1a', border: '1px solid #333',
    borderRadius: '8px', color: '#fff',
    fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = { color: '#aaa', fontSize: '0.8rem', display: 'block', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <button onClick={() => router.push('/admin/dashboard')}
          style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '8px', fontSize: '0.9rem' }}>
          ← Back
        </button>
        <h1 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '32px' }}>Site Settings</h1>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '1.1rem' }}>Impact Numbers</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Active Members</label>
                <input type="number" style={inputStyle} value={form.members}
                  onChange={e => setForm({ ...form, members: Number(e.target.value) })} />
              </div>
              <div>
                <label style={labelStyle}>Events Conducted</label>
                <input type="number" style={inputStyle} value={form.events}
                  onChange={e => setForm({ ...form, events: Number(e.target.value) })} />
              </div>
              <div>
                <label style={labelStyle}>Projects Built</label>
                <input type="number" style={inputStyle} value={form.projects}
                  onChange={e => setForm({ ...form, projects: Number(e.target.value) })} />
              </div>
              <div>
                <label style={labelStyle}>Industry Partners</label>
                <input type="number" style={inputStyle} value={form.partners}
                  onChange={e => setForm({ ...form, partners: Number(e.target.value) })} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ marginTop: '24px', background: '#06b6d4', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
              {loading ? 'Saving...' : saved ? '✅ Saved!' : 'Save Settings'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}