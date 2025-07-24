const express= require("express");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,markStar
} = require("../controllers/noteController");
const verifyUser=require("../middlewares/auth");

const router = express.Router();

router.post("/create-note", verifyUser,createNote);
router.get("/get-notes",verifyUser, getNotes);
router.put("/update-note/:id",verifyUser, updateNote);
router.delete("/delete-note/:id",verifyUser, deleteNote);

router.put("/notes/:id/star",verifyUser, markStar);



module.exports=router;
