import React, { useEffect, useState } from "react";

function Allnotes({ user }) {
  const [notes, setNotes] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(
      /*   `http://127.0.0.1:8000/api/notes/`, */
      "https://notes-backend-awu3.onrender.com/api/notes/",
      {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setNotes(data);
          // Only show categories that are present in this user's notes
          const cats = Array.from(
            new Set(data.map((note) => note.category).filter(Boolean))
          );
          setCategories(cats);
        } else {
          setNotes([]);
          setCategories([]);
        }
      })
      .catch(() => {
        setNotes([]);
        setCategories([]);
      });
  }, [user]);

  const filteredNotes = category
    ? notes.filter((note) => note.category === category)
    : notes;

  // Edit handlers (like Notecreatepage.jsx)
  const handleEdit = (note) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category);
    setMessage("");
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    setEditCategory("");
    setMessage("");
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(
        /* `http://127.0.0.1:8000/api/notes/${id}/`,  */
        `https://notes-backend-awu3.onrender.com/api/notes/${id}/`,
        {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  // Delete handler (like Notecreatepage.jsx)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(
       /*  `http://127.0.0.1:8000/api/notes/${id}/`, */
        `https://notes-backend-awu3.onrender.com/api/notes/${id}/`,
         {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
    <div className="container mt-4">
      <h1 className="text-primary">All Notes</h1>
      <div className="mb-3">
        <label htmlFor="categorySelect" className="form-label">
          <h5 className="mt-3">Select Category:</h5>
        </label>
        <select
          id="categorySelect"
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">
            <h5 className="fw-bold">All Categories</h5>
          </option>
          {categories.length === 0 && <option disabled>No categories</option>}
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>
      {message && <div className="alert alert-info py-2">{message}</div>}
      <div className="row mt-lg-5">
        {filteredNotes.length === 0 ? (
          <div className="text-muted">No notes found.</div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="allnotes col-lg-5 mx-lg-5   card mb-3">
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
                      {/* You can use a static list or categories from notes */}
                      <option value="entertainment">Entertainment</option>
                      <option value="sports">Sports</option>
                      <option value="food">Food</option>
                      <option value="daily_life_style">Daily Life Style</option>
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
                    <div className="text-muted" style={{ fontSize: "0.9em" }}>
                      By: {note.user} |{" "}
                      {note.created_at
                        ? new Date(note.created_at).toLocaleString()
                        : ""}
                      <span className="badge bg-primary ms-2">
                        {note.category}
                      </span>
                    </div>
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
          ))
        )}
      </div>
    </div>
  );
}

export default Allnotes;
