// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import { Plus, Trash2, Edit2, Save } from "lucide-react";
// // import { useSelector } from "react-redux";
// // import toast from "react-hot-toast";

// // export default function Notes() {
// //   const [notes, setNotes] = useState([]);
// //   const [adding, setAdding] = useState(false);
// //   const [newNote, setNewNote] = useState({ title: "", content: "" });
// //   const [editingId, setEditingId] = useState(null);
// //   const [editedNote, setEditedNote] = useState({});
// //   const user = useSelector((state) => state.user);
// //   const token = user.token;

// //   const fetchNotes = async () => {
// //     try {
// //       const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-notes`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setNotes(res.data.notes);
// //     } catch (err) {
// //       console.error("Error fetching notes", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchNotes();
// //   }, []);

// //   const handleAddNote = async () => {
// //     if (!newNote.title) return toast.error("Title required");
// //     try {
// //       const res = await axios.post(
// //         `${import.meta.env.VITE_BACKEND_URL}/create-note`,
// //         newNote,
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );
// //       setNotes([res.data.note, ...notes]);
// //       setNewNote({ title: "", content: "" });
// //       setAdding(false);
// //       toast.success("Note added");
// //     } catch (err) {
// //       console.error("Error adding note", err);
// //     }
// //   };

// //   const handleEditNote = async (id) => {
// //     try {
// //       const res = await axios.put(
// //         `${import.meta.env.VITE_BACKEND_URL}/update-note/${id}`,
// //         editedNote,
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );
// //       setNotes(notes.map((n) => (n._id === id ? res.data.note : n)));
// //       setEditingId(null);
// //       toast.success("Updated");
// //     } catch (err) {
// //       console.error("Error updating", err);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     try {
// //       await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete-note/${id}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setNotes(notes.filter((n) => n._id !== id));
// //       toast.success("Deleted");
// //     } catch (err) {
// //       console.error("Delete error", err);
// //     }
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto p-4 min-h-screen bg-white">
// //       <div className="flex justify-between items-center mb-6">
// //         <h2 className="text-3xl font-bold text-[#3D550C]">My Notes</h2>
// //         <button
// //           onClick={() => setAdding(true)}
// //           className="bg-[#81B622] text-white px-4 py-2 rounded hover:bg-[#3D550C]"
// //         >
// //           <Plus size={20} />
// //         </button>
// //       </div>

// //       {adding && (
// //         <div className="bg-[#FAFFF2] p-4 mb-6 rounded-xl shadow">
// //           <input
// //             placeholder="Title"
// //             value={newNote.title}
// //             onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
// //             className="w-full mb-2 text-lg font-semibold bg-transparent outline-none"
// //           />
// //           <textarea
// //             placeholder="Write something..."
// //             value={newNote.content}
// //             onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
// //             className="w-full bg-transparent outline-none resize-none"
// //           />
// //           <div className="text-right mt-2">
// //             <button
// //               onClick={handleAddNote}
// //               className="text-sm px-3 py-1 bg-[#81B622] text-white rounded hover:bg-[#3D550C]"
// //             >
// //               Save
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         {notes.map((note) => (
// //           <div
// //             key={note._id}
// //             className="bg-[#F9FAF5] p-4 rounded-xl shadow relative"
// //           >
// //             {editingId === note._id ? (
// //               <>
// //                 <input
// //                   value={editedNote.title}
// //                   onChange={(e) =>
// //                     setEditedNote({ ...editedNote, title: e.target.value })
// //                   }
// //                   className="w-full text-lg font-bold bg-transparent outline-none"
// //                 />
// //                 <textarea
// //                   value={editedNote.content}
// //                   onChange={(e) =>
// //                     setEditedNote({ ...editedNote, content: e.target.value })
// //                   }
// //                   className="w-full bg-transparent outline-none resize-none mt-2"
// //                 />
// //                 <div className="flex justify-end gap-2 mt-2">
// //                   <button
// //                     onClick={() => handleEditNote(note._id)}
// //                     className="text-green-600"
// //                   >
// //                     <Save size={20} />
// //                   </button>
// //                 </div>
// //               </>
// //             ) : (
// //               <>
// //                 <h3 className="text-lg font-bold text-[#3D550C]">{note.title}</h3>
// //                 <p className="mt-1 text-[#4B5563] whitespace-pre-wrap">{note.content}</p>
// //                 <div className="absolute top-4 right-4 flex gap-3">
// //                   <Edit2
// //                     size={18}
// //                     className="text-[#81B622] cursor-pointer"
// //                     onClick={() => {
// //                       setEditingId(note._id);
// //                       setEditedNote(note);
// //                     }}
// //                   />
// //                   <Trash2
// //                     size={18}
// //                     className="text-red-500 cursor-pointer"
// //                     onClick={() => handleDelete(note._id)}
// //                   />
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         ))}
// //       </div>

// //       {notes.length === 0 && !adding && (
// //         <p className="text-center text-gray-500 mt-10">No notes yet.</p>
// //       )}
// //     </div>
// //   );
// // }





// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Trash2, Edit2, Save, Star, StarOff, X } from "lucide-react";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";

// export default function Notes() {
//   const [notes, setNotes] = useState([]);
//   const [adding, setAdding] = useState(false);
//   const [newNote, setNewNote] = useState({ title: "", content: "" });
//   const [editingId, setEditingId] = useState(null);
//   const [editedNote, setEditedNote] = useState({});
//   const [selectedNote, setSelectedNote] = useState(null);
//   const user = useSelector((state) => state.user);
//   const token = user.token;

//   const fetchNotes = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-notes`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotes(res.data.notes);
//     } catch (err) {
//       console.error("Error fetching notes", err);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const handleAddNote = async () => {
//     if (!newNote.title) return toast.error("Title required");
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/create-note`,
//         { ...newNote, starred: false },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNotes([res.data.note, ...notes]);
//       setNewNote({ title: "", content: "" });
//       setAdding(false);
//       toast.success("Note added");
//     } catch (err) {
//       console.error("Error adding note", err);
//     }
//   };

//   const handleEditNote = async (id) => {
//     try {
//       const res = await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/update-note/${id}`,
//         editedNote,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNotes(notes.map((n) => (n._id === id ? res.data.note : n)));
//       setEditingId(null);
//       toast.success("Updated");
//     } catch (err) {
//       console.error("Error updating", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete-note/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotes(notes.filter((n) => n._id !== id));
//       toast.success("Deleted");
//     } catch (err) {
//       console.error("Delete error", err);
//     }
//   };

//   const toggleStar =async  (id) => {
//     const updated = notes.map((note) =>
//       note._id === id ? { ...note, starred: !note.starred } : note
//     );
//     setNotes(updated);
//     await axios.put(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}/star`,{}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 min-h-screen ">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-[#3D550C]">My Notes</h2>
//         <button
//           onClick={() => setAdding(true)}
//           className="bg-[#81B622] text-white px-4 py-2 rounded hover:bg-[#3D550C]"
//         >
//           <Plus size={20} />
//         </button>
//       </div>

//       {adding && (
//         <div className="bg-[#FAFFF2] p-4 mb-6 rounded-xl shadow">
//           <input
//             placeholder="Title"
//             value={newNote.title}
//             onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
//             className="w-full mb-2 text-lg font-semibold bg-transparent outline-none"
//           />
//           <textarea
//             placeholder="Write something..."
//             value={newNote.content}
//             onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
//             className="w-full bg-transparent outline-none resize-none"
//           />
//           <div className="text-right mt-2">
//             <button
//               onClick={handleAddNote}
//               className="text-sm px-3 py-1 bg-[#81B622] text-white rounded hover:bg-[#3D550C]"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {notes.map((note) => (
//           <div
//             key={note._id}
//             className="bg-[#F9FAF5] p-4 rounded-xl shadow relative cursor-pointer"
//             onClick={() => setSelectedNote(note)}
//           >
//             {editingId === note._id ? (
//               <>
//                 <input
//                   value={editedNote.title}
//                   onChange={(e) =>
//                     setEditedNote({ ...editedNote, title: e.target.value })
//                   }
//                   className="w-full text-lg font-bold bg-transparent outline-none"
//                 />
//                 <textarea
//                   value={editedNote.content}
//                   onChange={(e) =>
//                     setEditedNote({ ...editedNote, content: e.target.value })
//                   }
//                   className="w-full bg-transparent outline-none resize-none mt-2"
//                 />
//                 <div className="flex justify-end gap-2 mt-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleEditNote(note._id);
//                     }}
//                     className="text-green-600"
//                   >
//                     <Save size={20} />
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h3 className="text-lg font-bold text-[#3D550C]">{note.title}</h3>
//                 <p className="mt-1 text-[#4B5563] text-sm line-clamp-2">
//                   {note.content?.split("\n").slice(0, 2).join(" ")}
//                 </p>
//                 <div className="absolute top-4 right-4 flex gap-3 z-10">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleStar(note._id);
//                     }}
//                   >
//                     {/* {note.starred ? ( */}
//                       <Star size={18} className={`${note.starred ?"text-yellow-500":"text-black"}`} fill={`${note.starred?"currentColor":"none"}`} />
//                    { // ) : (
//                     //   <StarOff size={18} className="text-gray-400" />
//                     // )
//                    }</button>
//                   <Edit2
//                     size={18}
//                     className="text-[#81B622]"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setEditingId(note._id);
//                       setEditedNote(note);
//                     }}
//                   />
//                   <Trash2
//                     size={18}
//                     className="text-red-500"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(note._id);
//                     }}
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </div>

//       {notes.length === 0 && !adding && (
//         <p className="text-center text-gray-500 mt-10">No notes yet.</p>
//       )}

//       {/* Modal for selected note */}
//       {selectedNote && (
//         <div className="fixed inset-0 bg-black/30  flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
//             <button
//               onClick={() => setSelectedNote(null)}
//               className="absolute top-2 right-2 text-gray-600"
//             >
//               <X />
//             </button>
//             <h2 className="text-2xl font-bold text-[#3D550C] mb-2">{selectedNote.title}</h2>
//             <p className="whitespace-pre-wrap text-[#4B5563]">{selectedNote.content}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



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
