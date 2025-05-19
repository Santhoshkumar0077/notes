import express from "express";
import {
	getAllNote,
	createNote,
	updateNote,
	deleteNote,
	getNote,
} from "../controllers/noteController.js";
import auth from "../middlewares/authMiddleware.js";
const router = express.Router();

router.use(auth);

router.get("/getAll", getAllNote);
router.get("/getOne/:noteId", getNote);
router.post("/create", createNote);
router.put("/update/:noteId", updateNote);
router.delete("/delete/:noteId", deleteNote);

export default router;
