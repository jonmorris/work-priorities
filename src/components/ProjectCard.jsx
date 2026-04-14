import { useState } from 'react'

export default function ProjectCard({
  project, rank, isFirst, isLast, animating,
  onMoveUp, onMoveDown, onEdit, onDelete, onComplete
}) {
  const [confirming, setConfirming] = useState(false)

  const priorityClass = project.priority?.toLowerCase() || 'low'
  const statusClass = project.status === 'In Progress' ? 'in-progress'
    : project.status === 'Blocked' ? 'blocked' : ''

  const cardClass = [
    'card',
    animating === 'up' ? 'moving-up' : '',
    animating === 'down' ? 'moving-down' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>
      <div className={`card-priority-bar ${priorityClass}`} />
      <div className="card-rank">{rank}</div>
      <div className="card-body">
        <div className="card-title">{project.title}</div>
        {project.description && (
          <div className="card-desc">{project.description}</div>
        )}
        <div className="card-meta">
          <span className={`tag tag-${priorityClass}`}>{project.priority || 'Low'}</span>
          {project.status && (
            <>
              <span className="meta-dot">&middot;</span>
              <span className={`status-tag ${statusClass}`}>{project.status}</span>
            </>
          )}
          {project.owner && (
            <>
              <span className="meta-dot">&middot;</span>
              <span className="meta-text">{project.owner}</span>
            </>
          )}
          {project.dueDate && (
            <>
              <span className="meta-dot">&middot;</span>
              <span className="meta-text">Due {project.dueDate}</span>
            </>
          )}
        </div>

        {confirming && (
          <div className="delete-confirm">
            <span className="delete-confirm-text">Delete this project?</span>
            <button className="btn btn-sm" onClick={() => setConfirming(false)}>Cancel</button>
            <button className="btn btn-sm btn-danger" onClick={() => { setConfirming(false); onDelete(); }}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="card-actions">
        <div className="reorder-btns">
          <button
            className="btn btn-icon btn-ghost"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move up"
          >&#9650;</button>
          <button
            className="btn btn-icon btn-ghost"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move down"
          >&#9660;</button>
        </div>
        <div className="card-action-row">
          <button className="btn btn-icon btn-ghost" onClick={onEdit} title="Edit">&#9998;</button>
          <button className="btn btn-icon btn-ghost" onClick={onComplete} title="Complete">&#10003;</button>
          <button
            className="btn btn-icon btn-ghost btn-danger"
            onClick={() => setConfirming(true)}
            title="Delete"
          >&#10005;</button>
        </div>
      </div>
    </div>
  )
}
