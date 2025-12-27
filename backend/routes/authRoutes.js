import express from "express";
import { createAdmin, deleteAll, deleteById, login, logout, readUsers, refreshAccessToken, register } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refreshAccessToken', refreshAccessToken);
router.post('/create-admin', verifyToken, authorize('super-admin'),createAdmin);
router.get('/read', verifyToken, authorize('super-admin', 'admin'), readUsers);
router.delete('/delete-all', verifyToken, authorize('super-admin'), deleteAll);
router.delete('/delete/:id', verifyToken, authorize('super-admin', 'admin'), deleteById);
export default router;