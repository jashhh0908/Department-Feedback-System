import express from "express";
import { createForm, deactivateForm, deleteForm, getForm, getFormById, reactivateForm, toggleFormStatus, updateForm } from "../controllers/formController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post('/create', verifyToken, authorize("admin"), createForm);
router.get('/get', verifyToken, authorize("admin"), getForm);
router.get('/get/:id', verifyToken, authorize("admin"), getFormById);
router.put('/update/:id', verifyToken, authorize("admin"), updateForm);
router.post('/toggle/:id', verifyToken, authorize("admin"), toggleFormStatus);
router.post('/deactivate/:id', verifyToken, authorize("admin"), deactivateForm);
router.post('/reactivate/:id', verifyToken, authorize("admin"), reactivateForm)
router.delete('/delete/:id', verifyToken, authorize("admin"), deleteForm);
export default router; 
