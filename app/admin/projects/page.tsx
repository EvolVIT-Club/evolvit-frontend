'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

interface Project {
  _id: string;
  name: string;
  description: string;
  techStack: string[];
  projectLink: string;
  githubLink: string;
  featured: boolean;
}

const emptyForm = {
  name: '',
  description: '',
  techStack: '',
  projectLink: '',
  githubLink: '',
};

export default function AdminProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchProjects = async () => {
    const { data } = await api.get('/projects');
    setProjects(data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      alert('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setForm({
      name: project.name,
      description: project.description,
      techStack: project.techStack.join(', '),
      projectLink: project.projectLink || '',
      githubLink: project.githubLink || '',
    });
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    fetchProjects();
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
            <h1 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>Manage Projects</h1>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>
            + Add Project
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '1.1rem' }}>
              {editingId ? 'Edit Project' : 'New Project'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Project Name *</label>
                  <input style={inputStyle} value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={labelStyle}>Tech Stack (comma separated)</label>
                  <input style={inputStyle} placeholder="React, Node.js, MongoDB"
                    value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Project Link</label>
                  <input style={inputStyle} placeholder="https://..."
                    value={form.projectLink} onChange={e => setForm({ ...form, projectLink: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>GitHub Link</label>
                  <input style={inputStyle} placeholder="https://github.com/..."
                    value={form.githubLink} onChange={e => setForm({ ...form, githubLink: e.target.value })} />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" disabled={loading}
                  style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
                  {loading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ background: 'transparent', color: '#aaa', border: '1px solid #333', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
                  Cancel
                </button>

                
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {projects.map(project => (
            <div key={project._id} style={{
              background: '#111', border: '1px solid #222',
              borderRadius: '12px', padding: '20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <span style={{ color: '#fff', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  {project.name}
                </span>
                <span style={{ color: '#555', fontSize: '0.85rem' }}>
                  {project.techStack.join(' · ')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(project)}
                  style={{ background: '#1a1a1a', color: '#aaa', border: '1px solid #333', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(project._id)}
                  style={{ background: '#1a1a1a', color: '#ef4444', border: '1px solid #ef444440', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer' }}>
                  Delete
                </button>
                <button
    onClick={async () => {
      await api.patch(`/projects/${project._id}/featured`);
      fetchProjects();
    }}
    style={{
      background: project.featured ? '#3b82f620' : '#1a1a1a',
      color: project.featured ? '#3b82f6' : '#aaa',
      border: `1px solid ${project.featured ? '#3b82f640' : '#333'}`,
      borderRadius: '6px',
      padding: '6px 14px',
      cursor: 'pointer'
    }}
  >
    {project.featured ? '⭐ Featured' : 'Feature'}
  </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}