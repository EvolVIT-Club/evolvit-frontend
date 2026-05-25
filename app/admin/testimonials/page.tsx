'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  message: string;
  avatar?: string;
  photo?: string;
}

const emptyForm = { name: '', role: '', message: '', avatar: '' };

export default function AdminTestimonials() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchTestimonials = async () => {
    const { data } = await api.get('/testimonials');
    setTestimonials(data);
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, form);
      } else {
        await api.post('/testimonials', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchTestimonials();
    } catch (err) {
      alert('Error saving testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (t: Testimonial) => {
    setForm({ name: t.name, role: t.role, message: t.message, avatar: t.avatar || '' });
    setEditingId(t._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await api.delete(`/testimonials/${id}`);
    fetchTestimonials();
  };
  const handlePhotoUpload = async (id: string, files: FileList) => {
  const formData = new FormData();
  formData.append('photo', files[0]);
  try {
    await api.post(`/testimonials/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('Photo uploaded!');
    fetchTestimonials();
  } catch (err) {
    alert('Upload failed');
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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <button onClick={() => router.push('/admin/dashboard')}
              style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '8px', fontSize: '0.9rem' }}>
              ← Back
            </button>
            <h1 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>Manage Testimonials</h1>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
            style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>
            + Add Testimonial
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '1.1rem' }}>
              {editingId ? 'Edit Testimonial' : 'New Testimonial'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Role *</label>
                  <input style={inputStyle} placeholder="e.g. ML Engineer · EvolVIT Alum" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Avatar Initial (single letter)</label>
                  <input style={inputStyle} placeholder="e.g. K" maxLength={1} value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} />
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>Message *</label>
                <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" disabled={loading}
                  style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Add Testimonial'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ background: 'transparent', color: '#aaa', border: '1px solid #333', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {testimonials.map(t => (
            <div key={t._id} style={{
              background: '#111', border: '1px solid #222',
              borderRadius: '12px', padding: '20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <span style={{ color: '#fff', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{t.name}</span>
                <span style={{ color: '#f59e0b', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>{t.role}</span>
                <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0, maxWidth: '600px' }}>{t.message}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => handleEdit(t)}
                  style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #333', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(t._id)}
                  style={{ background: '#1a1a1a', color: '#ef4444', border: '1px solid #ef444440', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                  Delete
                </button>
                <label style={{
  background: '#1a1a1a', color: '#f59e0b',
  border: '1px solid #f59e0b40', borderRadius: '6px',
  padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem'
}}>
  + Photo
  <input
    type="file"
    accept="image/*"
    style={{ display: 'none' }}
    onChange={(e) => e.target.files && handlePhotoUpload(t._id, e.target.files)}
  />
</label>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}