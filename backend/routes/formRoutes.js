import express from "express";
import { createForm, getForm, getFormById, toggleFormStatus, updateForm } from "../controllers/formController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post('/create', verifyToken, authorize("admin"), createForm);
router.get('/get', verifyToken, authorize("admin"), getForm);
router.get('/get/:id', verifyToken, authorize("admin"), getFormById);
router.put('/update/:id', verifyToken, authorize("admin"), updateForm);
router.post('/toggle/:id', verifyToken, authorize("admin"), toggleFormStatus);
export default router; 
