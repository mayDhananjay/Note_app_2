import express from 'express';
import Note from'../models/note.js'
import { protect } from '../middleware/auth.js';

const router = express.Router();

//get Shared notes
router.get("/share/:id", async (req, res) => {
  try {
    if (global.useMemoryDb) {
      const note = global.memoryNotes.find(n => n._id.toString() === req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      return res.status(200).json(note);
    }

    try {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }
      res.status(200).json(note);
    } catch (dbErr) {
      console.warn("[AI Studio] DB note share fetch failed, trying memory fallback:", dbErr.message);
      const note = global.memoryNotes.find(n => n._id.toString() === req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(200).json(note);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

//get all notes
router.get('/',protect,async(req,res)=>{
    try{
        if (global.useMemoryDb) {
            const userNotes = global.memoryNotes.filter(n => n.createdBy.toString() === req.user._id.toString());
            return res.json(userNotes);
        }

        try {
            const newNotes = await Note.find({ createdBy: req.user._id });
            res.json(newNotes);
        } catch (dbErr) {
            console.warn("[AI Studio] DB get all notes failed, trying memory fallback:", dbErr.message);
            const userNotes = global.memoryNotes.filter(n => n.createdBy.toString() === req.user._id.toString());
            res.json(userNotes);
        }
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})

// create a notes 

router.post('/',protect,async(req,res)=>{
    const{title,description}=req.body;
    try{
        if(!title || !description){ 
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        if (global.useMemoryDb) {
            const note = {
                _id: 'mem_note_' + Date.now() + Math.random().toString(36).substr(2, 5),
                title,
                description,
                createdBy: req.user._id,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            global.memoryNotes.push(note);
            return res.status(201).json(note);
        }

        try {
            const note = await Note.create({
                title,
                description,
                createdBy: req.user._id
            });
            res.status(201).json(note);
        } catch (dbErr) {
            console.warn("[AI Studio] DB create note failed, trying memory fallback:", dbErr.message);
            const note = {
                _id: 'mem_note_' + Date.now() + Math.random().toString(36).substr(2, 5),
                title,
                description,
                createdBy: req.user._id,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            global.memoryNotes.push(note);
            res.status(201).json(note);
        }
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
})
//get a notes 
router.get('/:id',protect,async(req,res)=>{
    try{
        if (global.useMemoryDb) {
            const note = global.memoryNotes.find(n => n._id.toString() === req.params.id);
            if(!note){
                return res.status(404).json({ message: "Note not found" });
            }
            if(note.createdBy.toString() !== req.user._id.toString()){
                return res.status(401).json({ message: "Not authorized" });
            }
            return res.json(note);
        }

        try {
            const note = await Note.findById(req.params.id);
            if(!note){
                return res.status(404).json({ message: "Note not found" });
            }
            if(note.createdBy.toString() !== req.user._id.toString()){
                return res.status(401).json({ message: "Not authorized" });
            }
            res.json(note);
        } catch (dbErr) {
            console.warn("[AI Studio] DB get note failed, trying memory fallback:", dbErr.message);
            const note = global.memoryNotes.find(n => n._id.toString() === req.params.id);
            if(!note){
                return res.status(404).json({ message: "Note not found" });
            }
            if(note.createdBy.toString() !== req.user._id.toString()){
                return res.status(401).json({ message: "Not authorized" });
            }
            res.json(note);
        }
    }catch(err){
         res.status(500).json({ message: err.message });
    }
})
//update a notes
router.put('/:id',protect,async(req,res)=>{
    const { title, description } = req.body;
    try{
        if (global.useMemoryDb) {
            const noteIndex = global.memoryNotes.findIndex(n => n._id.toString() === req.params.id);
            if(noteIndex === -1){
                return res.status(404).json({ message: "Note not found" });
            }
            const note = global.memoryNotes[noteIndex];
            if(note.createdBy.toString() !== req.user._id.toString()){
                return res.status(401).json({ message: "Not authorized" });
            }
            note.title = title || note.title;
            note.description = description || note.description;
            note.updatedAt = new Date();
            return res.json(note);
        }

        try {
            const notes =await Note.findById(req.params.id);
            if(!notes){
                return res.status(404).json({ message: "Note not found" });
            }
            if(notes.createdBy.toString() !== req.user._id.toString()){
                return res.status(401).json({ message: "Not authorized" });
            }
            notes.title = title || notes.title;
            notes.description = description || notes.description;
            const updatedNote = await notes.save();
            res.json(updatedNote);
        } catch (dbErr) {
            console.warn("[AI Studio] DB update note failed, trying memory fallback:", dbErr.message);
            const noteIndex = global.memoryNotes.findIndex(n => n._id.toString() === req.params.id);
            if(noteIndex === -1){
                return res.status(404).json({ message: "Note not found" });
            }
            const note = global.memoryNotes[noteIndex];
            if(note.createdBy.toString() !== req.user._id.toString()){
                return res.status(401).json({ message: "Not authorized" });
            }
            note.title = title || note.title;
            note.description = description || note.description;
            note.updatedAt = new Date();
            res.json(note);
        }
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})

//delete  notes
router.delete("/:id", protect, async (req, res) => {
  try {
    if (global.useMemoryDb) {
        const noteIndex = global.memoryNotes.findIndex(n => n._id.toString() === req.params.id);
        if(noteIndex === -1){
            return res.status(404).json({ message: "Note not found" });
        }
        const note = global.memoryNotes[noteIndex];
        if(note.createdBy.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Not authorized" });
        }
        global.memoryNotes.splice(noteIndex, 1);
        return res.json({ message: "Note deleted successfully" });
    }

    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
          return res.status(404).json({ message: "Note not found" });
        }

        if (note.createdBy.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: "Not authorized" });
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted successfully" });
    } catch (dbErr) {
        console.warn("[AI Studio] DB delete note failed, trying memory fallback:", dbErr.message);
        const noteIndex = global.memoryNotes.findIndex(n => n._id.toString() === req.params.id);
        if(noteIndex === -1){
            return res.status(404).json({ message: "Note not found" });
        }
        const note = global.memoryNotes[noteIndex];
        if(note.createdBy.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Not authorized" });
        }
        global.memoryNotes.splice(noteIndex, 1);
        res.json({ message: "Note deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
