'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

interface Event {
  _id: string;
  name: string;
  date: string;
  description: string;
  about: string;
  venue: string;
  status: 'upcoming' | 'past';
  registrationLink: string;
  category: string;
  color: string;
  emoji: string;
  featured: boolean;
}

const emptyForm = {
  name: '', date: '', description: '', about: '',
  venue: '', status: 'upcoming' as 'upcoming' | 'past',
  registrationLink: '', category: '', color: '#7c3aed', emoji: 'EVT',
};

export default function AdminEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchEvents = async () => {
    const { data } = await api.get('/events');
    setEvents(data);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, form);
      } else {
        await api.post('/events', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      alert('Error saving event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setForm({
      name: event.name,
      date: event.date.slice(0, 10),
      description: event.description,
      about: event.about || '',
      venue: event.venue,
      status: event.status as 'upcoming' | 'past',
      registrationLink: event.registrationLink || '',
      category: event.category || '',
      color: event.color || '#7c3aed',
      emoji: event.emoji || 'EVT',
    });
    setEditingId(event._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await api.delete(`/events/${id}`);
    fetchEvents();
  };

  const handlePhotoUpload = async (eventId: string, files: FileList) => {
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append('photos', file));
  
  try {
    await api.post(`/events/${eventId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('Photos uploaded!');
    fetchEvents();
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

  const labelStyle = {
    color: '#aaa', fontSize: '0.8rem',
    display: 'block', marginBottom: '6px',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <button onClick={() => router.push('/admin/dashboard')}
              style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '8px', fontSize: '0.9rem' }}>
              ← Back
            </button>
            <h1 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>Manage Events</h1>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
            style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>
            + Add Event
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '1.1rem' }}>
              {editingId ? 'Edit Event' : 'New Event'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Event Name *</label>
                  <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input type="date" style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Venue *</label>
                  <input style={inputStyle} value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Status *</label>
                  <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'upcoming' | 'past' })}>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <input style={inputStyle} placeholder="e.g. Hackathon" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Color</label>
                  <input type="color" style={{ ...inputStyle, height: '42px', padding: '4px' }} value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Emoji/Tag</label>
                  <input style={inputStyle} placeholder="e.g. HACK" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Registration Link</label>
                  <input style={inputStyle} placeholder="Google Form URL" value={form.registrationLink} onChange={e => setForm({ ...form, registrationLink: e.target.value })} />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>About (Extended Description)</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" disabled={loading}
                  style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
                  {loading ? 'Saving...' : editingId ? 'Update Event' : 'Add Event'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ background: 'transparent', color: '#aaa', border: '1px solid #333', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map(event => (
            <div key={event._id} style={{
              background: '#111', border: '1px solid #222',
              borderRadius: '12px', padding: '20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{event.name}</span>
                  <span style={{
                    background: event.status === 'upcoming' ? '#7c3aed20' : '#22222',
                    color: event.status === 'upcoming' ? '#7c3aed' : '#666',
                    border: `1px solid ${event.status === 'upcoming' ? '#7c3aed40' : '#333'}`,
                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem',
                  }}>{event.status}</span>
                </div>
                <span style={{ color: '#555', fontSize: '0.85rem' }}>
                  {new Date(event.date).toLocaleDateString()} · {event.venue}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(event)}
                  style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #333', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(event._id)}
                  style={{ background: '#1a1a1a', color: '#ef4444', border: '1px solid #ef444440', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                  Delete
                </button>
                <button
  onClick={async () => {
    await api.patch(`/events/${event._id}/featured`);
    fetchEvents();
  }}
  style={{
    background: event.featured ? '#7c3aed20' : '#1a1a1a',
    color: event.featured ? '#7c3aed' : '#aaa',
    border: `1px solid ${event.featured ? '#7c3aed40' : '#333'}`,
    borderRadius: '6px',
    padding: '6px 14px',
    cursor: 'pointer'
  }}
>
  {event.featured ? '⭐ Featured' : 'Feature'}
</button>
                
                <label style={{
  background: '#1a1a1a', color: '#22c55e',
  border: '1px solid #22c55e40', borderRadius: '6px',
  padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem'
}}>
  + Photos
  <input
    type="file"
    multiple
    accept="image/*"
    style={{ display: 'none' }}
    onChange={(e) => e.target.files && handlePhotoUpload(event._id, e.target.files)}
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
