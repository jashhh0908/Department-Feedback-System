import express from "express";
import { createForm } from "../controllers/formController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post('/create', verifyToken, authorize("admin"), createForm);

export default router; 
