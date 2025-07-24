const Note =require("../models/Note");

 const createNote = async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      user: req.user,
    });
    res.status(201).json({ note });
  } catch (error) {
    res.status(500).json({ message: "Error creating note" });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort({ updatedAt: -1 });
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

 const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    res.status(500).json({ message: "Error updating note" });
  }
};

 const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note" });
  }
};

async function markStar(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    note.starred = !note.starred;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle star" });
  }
}

module.exports={
    createNote,getNotes,deleteNote,updateNote,markStar
}