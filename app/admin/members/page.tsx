'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

interface Member {
  _id: string;
  name: string;
  category: 'team' | 'faculty';
  role: string;
  domain: string;
  emoji: string;
  image?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

const emptyForm = {
  name: '',
  role: '',
  emoji: '👨‍💻',
  category: 'team' as 'team' | 'faculty',
  domain: '',
  instagram: '',
  linkedin: '',
  github: '',
  twitter: '',
};

export default function AdminMembers() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchMembers = useCallback(async () => {
    const { data } = await api.get('/members');
    setMembers(data);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/members/${editingId}`, form);
      } else {
        await api.post('/members', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchMembers();
    } catch {
      alert('Error saving member');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: Member) => {
    setForm({
      name: member.name,
      role: member.role,
      category: member.category,
      domain: member.domain,
      emoji: member.emoji || '👨‍💻',
      instagram: member.instagram || '',
      linkedin: member.linkedin || '',
      github: member.github || '',
      twitter: member.twitter || '',
    });
    setEditingId(member._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this member?')) return;
    await api.delete(`/members/${id}`);
    fetchMembers();
  };

  const handlePhotoUpload = async (id: string, files: FileList) => {
    const formData = new FormData();
    formData.append('photo', files[0]);
    try {
      await api.post(`/members/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Photo uploaded!');
      fetchMembers();
    } catch {
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

  const teamMembers = members.filter(m => m.category === 'team');
  const facultyMembers = members.filter(m => m.category === 'faculty');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <button onClick={() => router.push('/admin/dashboard')}
              style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '8px', fontSize: '0.9rem' }}>
              ← Back
            </button>
            <h1 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>Manage Members</h1>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
            style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>
            + Add Member
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '1.1rem' }}>
              {editingId ? 'Edit Member' : 'New Member'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Role *</label>
                  <select style={inputStyle} value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })} required>
                    <option value="">Select role…</option>
                    <option value="Coordinator">Coordinator</option>
                    <option value="Team-Lead">Team Lead</option>
                    <option value="Co-Lead">Co-Lead</option>
                    <option value="Core-Member">Core Member</option>
                    <option value="General-Member">General Member</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Emoji</label>
                  <input style={inputStyle} placeholder="👨‍💻"
                    value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Domain *</label>
                  <select style={inputStyle} value={form.domain}
                    onChange={e => setForm({ ...form, domain: e.target.value })} required>
                    <option value="">Select domain…</option>
                    <option value="Tech-Team">Tech Team</option>
                    <option value="Design-Team">Design Team</option>
                    <option value="Media-Team">Media Team</option>
                    <option value="Event-Management-Team">Event Management Team</option>
                    <option value="PR-Team">PR Team</option>
                    <option value="Finance-Team">Finance Team</option>
                    <option value="Operations-Team">Operations Team</option>
                    <option value="Content-Team ">Content Team</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select style={inputStyle} value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as 'team' | 'faculty' })}>
                    <option value="team">Team</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>LinkedIn</label>
                  <input style={inputStyle} placeholder="https://linkedin.com/in/..."
                    value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>GitHub</label>
                  <input style={inputStyle} placeholder="https://github.com/..."
                    value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Instagram</label>
                  <input style={inputStyle} placeholder="https://instagram.com/..."
                    value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Twitter/X</label>
                  <input style={inputStyle} placeholder="https://x.com/..."
                    value={form.twitter} onChange={e => setForm({ ...form, twitter: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" disabled={loading}
                  style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
                  {loading ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ background: 'transparent', color: '#aaa', border: '1px solid #333', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Team Members */}
        <h2 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.1rem' }}>
          Team Members <span style={{ color: '#555', fontSize: '0.9rem' }}>({teamMembers.length})</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {teamMembers.map(member => (
            <div key={member._id} style={{
              background: '#111', border: '1px solid #222',
              borderRadius: '12px', padding: '20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {member.image ? (
                  <img src={member.image} alt={member.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>{member.emoji}</span>
                )}
                <div>
                  <span style={{ color: '#fff', fontWeight: 600, display: 'block' }}>{member.name}</span>
                  <span style={{ color: '#555', fontSize: '0.85rem' }}>{member.role}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(member)}
                  style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #333', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(member._id)}
                  style={{ background: '#1a1a1a', color: '#ef4444', border: '1px solid #ef444440', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                  Delete
                </button>
                <label style={{ background: '#1a1a1a', color: '#10b981', border: '1px solid #10b98140', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  + Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={(e) => e.target.files && handlePhotoUpload(member._id, e.target.files)} />
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Faculty Members */}
        <h2 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.1rem' }}>
          Faculty <span style={{ color: '#555', fontSize: '0.9rem' }}>({facultyMembers.length})</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {facultyMembers.map(member => (
            <div key={member._id} style={{
              background: '#111', border: '1px solid #222',
              borderRadius: '12px', padding: '20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {member.image ? (
                  <img src={member.image} alt={member.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>{member.emoji}</span>
                )}
                <div>
                  <span style={{ color: '#fff', fontWeight: 600, display: 'block' }}>{member.name}</span>
                  <span style={{ color: '#555', fontSize: '0.85rem' }}>{member.role}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(member)}
                  style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #333', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(member._id)}
                  style={{ background: '#1a1a1a', color: '#ef4444', border: '1px solid #ef444440', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                  Delete
                </button>
                <label style={{ background: '#1a1a1a', color: '#10b981', border: '1px solid #10b98140', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  + Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={(e) => e.target.files && handlePhotoUpload(member._id, e.target.files)} />
                </label>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}