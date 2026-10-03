'use client';

import { useEffect, useRef, useState } from 'react';
import NoteItem from '../components/NoteItem';

const normalize = (value) => value.trim().replace(/\s+/g, ' ').toLowerCase();

export default function Home() {
  // useState holds all notes and the current form values.
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [duplicate, setDuplicate] = useState(false);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const deleteDialog = useRef(null);
  const titleInput = useRef(null);
  const currentNotes = useRef(notes);
  currentNotes.current = notes;

  useEffect(() => {
    if (pendingDelete) deleteDialog.current?.showModal();
    else deleteDialog.current?.close();
  }, [pendingDelete]);

  // Bonus: useEffect checks existing titles whenever notes or the form change.
  // Ignore the note currently being edited; ignore case and extra spaces.
  useEffect(() => {
    setDuplicate(Boolean(normalize(title)) && notes.some(
      (note) => note.id !== editingId && normalize(note.title) === normalize(title)
    ));
  }, [title, notes, editingId]);

  // Optional agent access is read-only and shares the exact visible note state.
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(context.registerTool({
        name: 'list_notes',
        title: 'View notes',
        description: 'Return all notes currently shown in this notebook.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        execute(input) {
          if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('No input fields are accepted.');
          return { notes: currentNotes.current.map(({ id, title, description }) => ({ id, title, description })) };
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* Unsupported experimental browsers still use the normal UI. */ }
    return () => lifecycle.abort();
  }, []);

  function resetForm() {
    setTitle(''); setDescription(''); setEditingId(null); setDuplicate(false);
  }

  function saveNote(event) {
    event.preventDefault();
    const cleanTitle = title.trim().replace(/\s+/g, ' ');
    const cleanDescription = description.trim();
    if (!cleanTitle || !cleanDescription) { setMessage('Please enter a title and description.'); return; }
    // Recheck at submission so a fast click cannot bypass the effect.
    if (notes.some(note => note.id !== editingId && normalize(note.title) === normalize(cleanTitle))) {
      setDuplicate(true); setMessage('Choose a different title for this note.'); return;
    }
    const updatedAt = new Date().toISOString();
    if (editingId !== null) {
      setNotes(previous => previous.map(note => note.id === editingId ? { ...note, title: cleanTitle, description: cleanDescription, updatedAt } : note));
      setMessage('Note updated.');
    } else {
      const note = { id: crypto.randomUUID(), title: cleanTitle, description: cleanDescription, updatedAt };
      setNotes(previous => [note, ...previous]);
      setMessage('Note added.');
    }
    resetForm();
    titleInput.current?.focus();
  }

  function editNote(note) {
    setEditingId(note.id); setTitle(note.title); setDescription(note.description); setMessage('');
    titleInput.current?.focus();
    titleInput.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function deleteNote(note) {
    setPendingDelete(note);
  }

  function confirmDelete() {
    const note = pendingDelete;
    if (!note) return;
    setNotes(previous => previous.filter(item => item.id !== note.id));
    if (editingId === note.id) resetForm();
    setMessage('Note deleted.');
    setPendingDelete(null);
  }

  const ready = title.trim() && description.trim() && !duplicate;

  return (
    <div className="app-shell">
      <header className="site-header">
        <a href="/" className="brand" aria-label="Ink notes home"><span className="brand-mark">i.</span><span>ink<span className="brand-period">.</span></span></a>
        <span className="header-label">YOUR PERSONAL NOTEBOOK</span>
        <span className="owner">JD<span className="owner-name">John David</span></span>
      </header>
      <main>
        <div className="page-heading"><div><span className="eyebrow">A SPACE TO THINK</span><h1>Make room for ideas<span>.</span></h1></div><span className="heading-mark" aria-hidden="true">✳</span></div>
        <div className="workspace">
          <aside className="composer">
            <div className="composer-heading"><span className="small-plus" aria-hidden="true">{editingId ? '↺' : '+'}</span><h2>{editingId ? 'Edit your note' : 'A new thought'}</h2></div>
            <p className="composer-description">{editingId ? 'Give your idea a little update.' : 'Big plans. Small reminders. Start here.'}</p>
            <form onSubmit={saveNote}>
              <div className="field-label"><label htmlFor="note-title">Title</label><span>{title.length}/80</span></div>
              <input ref={titleInput} id="note-title" value={title} onChange={event => { setTitle(event.target.value); setMessage(''); }} placeholder="Give it a name" maxLength={80} required aria-invalid={duplicate} aria-describedby={duplicate ? 'duplicate-warning' : undefined} />
              {duplicate && <p id="duplicate-warning" className="field-error" role="alert">A note with this title already exists.</p>}
              <div className="field-label description-label"><label htmlFor="note-description">Description</label><span>{description.length}/2000</span></div>
              <textarea id="note-description" value={description} onChange={event => { setDescription(event.target.value); setMessage(''); }} placeholder="What's on your mind?" maxLength={2000} required rows={7} />
              <button className="primary-button" type="submit" disabled={!ready}><span aria-hidden="true">{editingId ? '✓' : '+'}</span>{editingId ? 'Save changes' : 'Add note'}</button>
              {editingId && <button className="cancel-button" type="button" onClick={() => { resetForm(); setMessage('Editing cancelled.'); }}>Cancel editing</button>}
              <p className="feedback" role="status" aria-live="polite">{message}</p>
            </form>
            <div className="composer-footer"><span className="footer-line" />One idea at a time.</div>
          </aside>
          <section className="notes-section" aria-labelledby="notes-heading">
            <div className="section-header"><h2 id="notes-heading">Your notes <span className="count">{notes.length}</span></h2><span className="section-caption">{notes.length ? 'LATEST FIRST' : 'A FRESH PAGE'}</span></div>
            {notes.length === 0 ? <div className="empty-state"><div className="empty-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M13 7h23v34H13a5 5 0 0 1-5-5V12a5 5 0 0 1 5-5ZM13 7v34M19 17h11M19 24h11M19 31h7" /></svg></div><span className="eyebrow">THE FIRST OF MANY</span><h3>Your next idea belongs here.</h3><p>Add your first note using the form.<br />We’ll keep your thoughts together.</p></div> : <div className="notes-grid">{notes.map((note, index) => <NoteItem key={note.id} note={note} index={index} isEditing={note.id === editingId} onEdit={editNote} onDelete={deleteNote} />)}</div>}
          </section>
        </div>
      </main>
      <footer className="site-footer"><span>INK / YOUR THOUGHTS, TOGETHER</span><span>Notes stay here while this page is open.</span></footer>
      <dialog ref={deleteDialog} className="delete-dialog" aria-labelledby="delete-heading" aria-describedby="delete-description" onCancel={() => setPendingDelete(null)} onClose={() => setPendingDelete(null)}>
        <h2 id="delete-heading">Delete note?</h2>
        <p id="delete-description">Delete “{pendingDelete?.title}”? This cannot be undone.</p>
        <div className="dialog-actions">
          <button type="button" className="cancel-button" autoFocus onClick={() => setPendingDelete(null)}>Cancel</button>
          <button type="button" className="primary-button" onClick={confirmDelete}>Delete note</button>
        </div>
      </dialog>
    </div>
  );
}
