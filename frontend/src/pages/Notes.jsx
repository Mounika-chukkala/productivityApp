

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus, Trash2, Edit2, Save, Star, X
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [editedNote, setEditedNote] = useState({});
  const [selectedNote, setSelectedNote] = useState(null);

  const user = useSelector((state) => state.user);
  const token = user.token;

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.title) return toast.error("Title required");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-note`,
        { ...newNote, starred: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([res.data.note, ...notes]);
      setNewNote({ title: "", content: "" });
      setAdding(false);
      toast.success("Note added");
    } catch (err) {
      console.error("Error adding note", err);
    }
  };

  const handleEditNote = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/update-note/${id}`,
        editedNote,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(notes.map((n) => (n._id === id ? res.data.note : n)));
      setEditingId(null);
      toast.success("Updated");
    } catch (err) {
      console.error("Error updating", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete-note/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
      toast.success("Deleted");
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const toggleStar = async (id) => {
    const updated = notes.map((note) =>
      note._id === id ? { ...note, starred: !note.starred } : note
    );
    setNotes(updated);
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/notes/${id}/star`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-sans  font-bold text-[#3D550C]">My Notes</h2>
        <button
          onClick={() => setAdding(true)}
          className="bg-[#81B622] hover:bg-[#3D550C] transition px-4 py-2 rounded-full text-white flex items-center gap-2"
        >
          <Plus size={20} />
          Add
        </button>
      </div>

      {/* Add New Note Box */}
      {adding && (
        <div className="relative bg-[#FAFFF2] border border-[#D1E8C1] p-4 mb-6 rounded-xl shadow animate-fade-in">
          <button
            onClick={() => setAdding(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-black"
          >
            <X />
          </button>
          <input
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full mb-2 text-lg font-semibold bg-transparent outline-none"
          />
          <textarea
            placeholder="Write something..."
            rows={5}
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="w-full bg-transparent outline-none resize-none"
          />
          <div className="text-right mt-2">
            <button
              onClick={handleAddNote}
              className="text-sm px-4 py-1.5 rounded-full bg-[#81B622] hover:bg-[#3D550C] text-white transition"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            onClick={() => setSelectedNote(note)}
            className={`p-4 rounded-xl shadow border transition cursor-pointer relative bg-white hover:shadow-md animate-fade-in ${
              note.starred ? "border-yellow-300 bg-yellow-50/40" : "border-gray-200"
            }`}
          >
            {editingId === note._id ? (
              <>
                <input
                  value={editedNote.title}
                  onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
                  className="w-full text-lg font-bold bg-transparent outline-none"
                />
                <textarea
                  value={editedNote.content}
                  onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
                  className="w-full bg-transparent outline-none resize-none mt-2"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditNote(note._id);
                    }}
                    className="text-green-600"
                  >
                    <Save size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-[#3D550C]">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(note._id);
                      }}
                    >
                      <Star
                        size={18}
                        className={note.starred ? "text-yellow-400" : "text-gray-400"}
                        fill={note.starred ? "currentColor" : "none"}
                      />
                    </button>
                    <Edit2
                      size={18}
                      className="text-[#81B622]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(note._id);
                        setEditedNote(note);
                      }}
                    />
                    <Trash2
                      size={18}
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note._id);
                      }}
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700 line-clamp-2 whitespace-pre-wrap">
                  {note.content}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {notes.length === 0 && !adding && (
        <p className="text-center text-gray-500 mt-10">No notes yet. Click add to begin!</p>
      )}

      {/* View Full Note Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white max-w-md w-full p-6 rounded-xl relative shadow-lg max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold text-[#3D550C] mb-2">
              {selectedNote.title}
            </h2>
            <p className="whitespace-pre-wrap text-gray-700">{selectedNote.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}
