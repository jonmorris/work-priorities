import { useState } from 'react'

export default function CompletedList({ projects, onRestore, onDelete }) {
  const [confirmId, setConfirmId] = useState(null)

  if (projects.length === 0) return null

  return (
    <>
      <div className="section-label">
        <span className="section-label-text">Completed</span>
        <span className="section-label-line" />
        <span className="section-label-count">{projects.length}</span>
      </div>
      <div className="card-list">
        {projects.map(project => {
          const completedDate = project.completedAt
            ? new Date(project.completedAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })
            : ''

          return (
            <div key={project.id} className="card completed">
              <div className={`card-priority-bar ${(project.priority || 'low').toLowerCase()}`} />
              <div className="card-rank">&mdash;</div>
              <div className="card-body">
                <div className="card-title">{project.title}</div>
                {project.description && (
                  <div className="card-desc">{project.description}</div>
                )}
                <div className="card-meta">
                  <span className={`tag tag-${(project.priority || 'low').toLowerCase()}`}>
                    {project.priority || 'Low'}
                  </span>
                  {completedDate && (
                    <>
                      <span className="meta-dot">&middot;</span>
                      <span className="completed-date">Completed {completedDate}</span>
                    </>
                  )}
                </div>

                {confirmId === project.id && (
                  <div className="delete-confirm">
                    <span className="delete-confirm-text">Delete permanently?</span>
                    <button className="btn btn-sm" onClick={() => setConfirmId(null)}>Cancel</button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => { setConfirmId(null); onDelete(project.id); }}
                    >Delete</button>
                  </div>
                )}
              </div>
              <div className="card-actions">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => onRestore(project.id)}
                  title="Restore to active"
                >&#8634;</button>
                <button
                  className="btn btn-sm btn-ghost btn-danger"
                  onClick={() => setConfirmId(project.id)}
                  title="Delete"
                >&#10005;</button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
