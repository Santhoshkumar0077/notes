import Note from "../models/Note.js";

export const getAllNote = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Notes found", notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error when getting notes." });
  }
};


export const getNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    if (!noteId) {
      return res.status(400).json({ message: "note id not found" });
    }
    const note = await Note.findOne({ _id: noteId });
    if (!note) {
      return res.status(400).json({ message: "note not found" });
    }
    res.status(200).json({ message: "note found", note });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error when getting note you requested." });
  }
};
export const createNote = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res.status(400).json({ message: "title or description missed" });
    }
    const note = await Note.create({ title, description, user: req.user.id });
    if (!note) {
      return res.status(400).json({ message: "error in note creation" });
    }
    res.status(201).json({ message: "note created", note });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Server error when creating notes." });
  }
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const details = req.body;
  try {
    if (!noteId) {
      return res.status(400).json({ message: "Missing note id" });
    }
    const note = await Note.findOne({ _id: noteId, user: req.user.id });
    if (!note) {
      return res.status(404).json({ message: "Note can't be found" });
    }
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: req.user.id },
      details,
      { new: true }
    );
    return res.status(200).json({ message: "Note updated", note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: "Server error when updating note" });
  }
};
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, user: req.user.id });

  if (!note) {
    return res.status(400).json({ message: "note not found" });
  }
  await note.deleteOne();
  res.status(200).json({ message: "note deleted" });
  try {
  } catch {
    res.status(500).json({ message: "server error when deleting note" });
  }
};
