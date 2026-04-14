import React, { useState, useEffect } from 'react'
import ProjectCard from './components/ProjectCard'
import AddEditModal from './components/AddEditModal'
import CompletedList from './components/CompletedList'

const STORE_KEY = 'work-priorities-v1'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveProjects(projects) {
  localStorage.setItem(STORE_KEY, JSON.stringify(projects))
}

export default function App() {
  const [projects, setProjects] = useState(loadProjects)
  const [modal, setModal] = useState(null) // null | { mode: 'add' } | { mode: 'edit', id }
  const [animating, setAnimating] = useState(null) // { id, direction }

  useEffect(() => { saveProjects(projects) }, [projects])

  const active = projects.filter(p => !p.completed)
  const completed = projects.filter(p => p.completed)

  function addProject(data) {
    setProjects(prev => [...prev, { ...data, id: uid(), completed: false, completedAt: null }])
  }

  function updateProject(id, data) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  function deleteProject(id) {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  function completeProject(id) {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, completed: true, completedAt: new Date().toISOString() } : p
    ))
  }

  function restoreProject(id) {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, completed: false, completedAt: null } : p
    ))
  }

  function moveProject(id, direction) {
    const idx = active.findIndex(p => p.id === id)
    if (idx < 0) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === active.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const swapId = active[swapIdx].id

    setAnimating({ id, direction })
    setTimeout(() => setAnimating(null), 260)

    setProjects(prev => {
      const activeIds = prev.filter(p => !p.completed).map(p => p.id)
      const ai = activeIds.indexOf(id)
      const si = direction === 'up' ? ai - 1 : ai + 1
      ;[activeIds[ai], activeIds[si]] = [activeIds[si], activeIds[ai]]

      const ordered = []
      let aidx = 0
      for (const p of prev) {
        if (!p.completed) {
          ordered.push(prev.find(pp => pp.id === activeIds[aidx]))
          aidx++
        } else {
          ordered.push(p)
        }
      }
      return ordered
    })
  }

  function handleSave(data) {
    if (modal.mode === 'add') addProject(data)
    else updateProject(modal.id, data)
    setModal(null)
  }

  const editingProject = modal?.mode === 'edit'
    ? projects.find(p => p.id === modal.id)
    : null

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">Work Priorities</h1>
          <div className="app-subtitle">{active.length} active project{active.length !== 1 ? 's' : ''}</div>
        </div>
        <button className="btn btn-accent" onClick={() => setModal({ mode: 'add' })}>
          + Add Project
        </button>
      </header>

      {active.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">&#9632;</div>
          <div className="empty-title">No active projects</div>
          <div className="empty-hint">Add your first project to start prioritizing.</div>
        </div>
      ) : (
        <div className="card-list">
          {active.map((project, index) => (
            <React.Fragment key={project.id}>
              <ProjectCard
                project={project}
                rank={index + 1}
                isFirst={index === 0}
                isLast={index === active.length - 1}
                animating={animating?.id === project.id ? animating.direction : null}
                onMoveUp={() => moveProject(project.id, 'up')}
                onMoveDown={() => moveProject(project.id, 'down')}
                onEdit={() => setModal({ mode: 'edit', id: project.id })}
                onDelete={() => deleteProject(project.id)}
                onComplete={() => completeProject(project.id)}
              />
              {index === 2 && active.length > 3 && (
                <div className="focus-line">
                  <span className="focus-line-label">Focus Line</span>
                  <span className="focus-line-rule" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <CompletedList
        projects={completed}
        onRestore={restoreProject}
        onDelete={deleteProject}
      />

      {modal && (
        <AddEditModal
          mode={modal.mode}
          project={editingProject}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
