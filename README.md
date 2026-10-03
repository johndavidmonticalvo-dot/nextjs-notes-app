# Ink — Next.js Notes App

A responsive note application made with **Next.js and React**. Add a title and description, view all notes, edit a note, and delete it with confirmation.

## Run locally

Install Node.js 20.9 or newer, then run:

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production/static build, run `npm run build`. The exported website is in `out/`.

## Assignment requirements

- `app/page.js` uses React's **useState** for notes, form values, editing state, and feedback.
- **useEffect** checks whether a note title already exists when the title, notes, or editing ID changes.
- Duplicate titles are checked without capitalization or extra-space differences. The current note is excluded when editing. Submission also checks duplicates immediately.
- `components/NoteItem.js` is the **separate Note Item component**, reused for every note.
- Add, view, update, delete, cancel editing, and delete confirmation are supported.
- Blank titles/descriptions are rejected.
- Notes are held in React state for the current page session. Refreshing or leaving the page clears them. There is no database or login.

## Screen recording checklist (about 60–90 seconds)

1. Open the app and start recording.
2. Add a note titled `School tasks` with description `Finish my Next.js notes assignment.`
3. Add another note titled `Weekend plan` with description `Practice coding for 30 minutes.`
4. Show that both notes appear.
5. Enter `school tasks` as a new title. Show the duplicate warning and disabled Add note button.
6. Clear that draft, then click Edit on School tasks. Change its description and click Save changes.
7. Click Edit again, change its title, then Cancel editing to show the original note stays unchanged.
8. Delete Weekend plan and confirm. Show that it disappears and School tasks remains.
9. Stop recording and submit the video with your public GitHub repository link.

## Upload to GitHub

Create a **new public repository** called `nextjs-notes-app`. Upload the source files and folders, including `app`, `components`, `public`, `package.json`, `package-lock.json`, `next.config.mjs`, `.gitignore`, and this README. Upload the extracted files, not just the ZIP. Do not upload `node_modules`, `.next`, or `out`. The `.openai` folder is for the hosted preview and is not needed for the GitHub assignment.
