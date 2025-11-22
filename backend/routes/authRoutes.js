import express from "express";
import { login, logout, refreshAccessToken, register } from "../controllers/authController.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refreshAccessToken', refreshAccessToken);
export default router;