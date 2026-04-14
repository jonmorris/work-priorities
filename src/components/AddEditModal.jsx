import { useState, useEffect, useRef } from 'react'

const PRIORITIES = ['High', 'Medium', 'Low']
const STATUSES = ['Not Started', 'In Progress', 'Blocked']

export default function AddEditModal({ mode, project, onSave, onClose }) {
  const [title, setTitle] = useState(project?.title || '')
  const [description, setDescription] = useState(project?.description || '')
  const [priority, setPriority] = useState(project?.priority || 'Medium')
  const [dueDate, setDueDate] = useState(project?.dueDate || '')
  const [owner, setOwner] = useState(project?.owner || '')
  const [status, setStatus] = useState(project?.status || 'Not Started')
  const [error, setError] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) { setError(true); titleRef.current?.focus(); return }
    onSave({ title: title.trim(), description: description.trim(), priority, dueDate, owner: owner.trim(), status })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span className="modal-title">{mode === 'add' ? 'Add Project' : 'Edit Project'}</span>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">Title *</label>
            <input
              ref={titleRef}
              className={`field-input ${error ? 'error' : ''}`}
              style={error ? { borderColor: 'var(--high)' } : {}}
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(false) }}
              placeholder="Project name"
            />
          </div>
          <div className="field">
            <label className="field-label">Description</label>
            <textarea
              className="field-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description (optional)"
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label className="field-label">Priority</label>
              <select className="field-input" value={priority} onChange={e => setPriority(e.target.value)}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Status</label>
              <select className="field-input" value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label className="field-label">Due Date</label>
              <input
                className="field-input"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">Team / Owner</label>
              <input
                className="field-input"
                type="text"
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="e.g. Design Team"
              />
            </div>
          </div>
          <div className="modal-foot" style={{ padding: 0, border: 'none', marginTop: '8px' }}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-accent">
              {mode === 'add' ? 'Add Project' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
