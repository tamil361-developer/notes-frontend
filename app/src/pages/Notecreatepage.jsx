import React, { useState } from "react";
import "./Notecreatepage.css";

function Notecreatepage({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch notes for the current user
  React.useEffect(() => {
    if (token) {
      fetch(
        /* "http://127.0.0.1:8000/api/notes/", */
        "https://notes-backend-awu3.onrender.com/api/notes/", {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((data) => setNotes(data));
    }
  }, [token]);

  const handleShowForm = () => setShowForm(true);
  const handleHideForm = () => {
    setShowForm(false);
    setTitle("");
    setContent("");
    setCategory("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!title.trim() || !content.trim() || !category) {
      setMessage("All fields are required.");
      return;
    }
    try {
      const res = await fetch(
        /* "http://127.0.0.1:8000/api/notes/", */
        "https://notes-backend-awu3.onrender.com/api/notes/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, category }),
        }
      );
      if (res.ok) {
        const newNote = await res.json();
        setNotes([newNote, ...notes]);
        setMessage("Note created!");
        setTitle("");
        setContent("");
        setCategory("");
        setTimeout(() => {
          setShowForm(false);
          setMessage("");
        }, 1000);
      } else {
        const data = await res.json();
        setMessage(
          data.detail || JSON.stringify(data) || "Failed to create note."
        );
      }
    } catch (err) {
      setMessage("Error creating note.");
      console.error(err);
    }
  };

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Edit handlers
  const handleEdit = (note) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    setEditCategory("");
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(
        /* `http://127.0.0.1:8000/api/notes/${id}/`, */
        `https://notes-backend-awu3.onrender.com/api/notes/${id}/`, 
        {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          category: editCategory,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes(notes.map((n) => (n.id === id ? updated : n)));
        setMessage("Note updated!");
        handleEditCancel();
      } else {
        setMessage("Failed to update note.");
      }
    } catch (err) {
      setMessage("Error updating note.");
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(
        /* `http://127.0.0.1:8000/api/notes/${id}/`, */
        `https://notes-backend-awu3.onrender.com/api/notes/${id}/`,
         {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        setNotes(notes.filter((n) => n.id !== id));
        setMessage("Note deleted.");
      } else {
        setMessage("Failed to delete note.");
      }
    } catch (err) {
      setMessage("Error deleting note.");
    }
  };

  return (
    <div className="container notecreatepage-container">
      <div className="notecreatepage-main">
        <button
          className="btn btn-primary rounded-circle plus-btn"
          onClick={handleShowForm}
          aria-label="Add Note"
        >
          +
        </button>

        {showForm && (
          <div className="card  p-4 shadow-sm mx-auto note-create-card animate__animated animate__fadeIn">
            <h1 className="mb-4 text-center">Create a new note</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title:</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter note title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category:</label>
                <select
                  name="category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="sports">Sports</option>
                  <option value="food">Food</option>
                  <option value="daily_life_style">Daily Life Style</option>
                  <option value="work">Work</option>
                  <option value="family">Family</option>
                  <option value="friends">Friends</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Content:</label>
                <textarea
                  name="content"
                  className="form-control"
                  rows="5"
                  placeholder="Enter note content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>
              {message && (
                <div className="alert alert-info py-2">{message}</div>
              )}
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success w-100">
                  Create Note
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={handleHideForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Show notes list */}
        <div className="row">
          <h3 className="text-danger ">Your Notes</h3>
          {notes.length === 0 && (
            <div className="text-muted">No notes yet.</div>
          )}

          {notes.map((note) => (
            <div className="col-lg-6">
              <div key={note.id} className="card note-card mt-2">
                <div className="card-body">
                  {editId === note.id ? (
                    <form onSubmit={(e) => handleEditSubmit(e, note.id)}>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                      />
                      <textarea
                        className="form-control mb-2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        required
                      />
                      <select
                        className="form-select mb-2"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="sports">Sports</option>
                        <option value="food">Food</option>
                        <option value="daily_life_style">
                          Daily Life Style
                        </option>
                        <option value="work">Work</option>
                        <option value="family">Family</option>
                        <option value="friends">Friends</option>
                      </select>
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-success btn-sm w-100"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm w-100"
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h5 className="card-title">{note.title}</h5>
                      <p className="card-text">{note.content}</p>
                      <p className="card-text">
                        <small className="text-muted">
                          {new Date(note.created_at).toLocaleString()} |
                        </small>
                        <span className="badge bg-primary ms-2">
                          {note.category}
                        </span>
                      </p>
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-warning btn-sm w-100"
                          onClick={() => handleEdit(note)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm w-100"
                          onClick={() => handleDelete(note.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Notecreatepage;

/* <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{note.title}</strong>{" "}
                  <span className="badge bg-secondary ms-2">
                    {note.category}
                  </span>
                </div>
                <small className="text-muted">
                  {new Date(note.created_at).toLocaleString()}
                </small>
              </div>
              <div className="mt-2">{note.content}</div>
              <div className="mt-2 text-muted" style={{ fontSize: "0.9em" }}>
                By: {note.user} | Note ID: {note.id}
              </div> */
