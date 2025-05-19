import express from "express";
import { register, login, logout, me } from "../controllers/userController.js";
import auth from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, me);
export default router;
