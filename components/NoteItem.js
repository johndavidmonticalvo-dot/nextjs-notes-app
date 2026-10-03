export default function NoteItem({ note, index, isEditing, onEdit, onDelete }) {
  return (
    <article className={`note-card ${isEditing ? 'editing' : ''}`}>
      <div className="card-top"><span className="note-number">{String(index + 1).padStart(2, '0')}</span><span>{isEditing ? 'EDITING' : 'NOTE'}</span></div>
      <h3>{note.title}</h3>
      <p className="note-description">{note.description}</p>
      <div className="card-bottom">
        <span className="note-date">{new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <div className="card-actions">
          <button type="button" className="text-button" onClick={() => onEdit(note)} aria-label={`Edit ${note.title}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1 12-12a2.8 2.8 0 0 0-4-4L4 15l-1 6Z" /></svg>Edit</button>
          <button type="button" className="text-button delete-button" onClick={() => onDelete(note)} aria-label={`Delete ${note.title}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></svg>Delete</button>
        </div>
      </div>
    </article>
  );
}
