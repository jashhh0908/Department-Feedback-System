import express from "express";
import { createForm, deactivateForm, deleteForm, getForm, getFormById, reactivateForm, toggleFormStatus, updateForm } from "../controllers/formController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { getResponses, submitResponse } from "../controllers/responseController.js";

const router = express.Router();

//admin-routes
router.post('/create', verifyToken, authorize("admin"), createForm);
router.get('/get', verifyToken, authorize("admin"), getForm);
router.get('/get/:id', verifyToken, authorize("admin"), getFormById);
router.put('/update/:id', verifyToken, authorize("admin"), updateForm);
router.post('/toggle/:id', verifyToken, authorize("admin"), toggleFormStatus);
router.post('/deactivate/:id', verifyToken, authorize("admin"), deactivateForm);
router.post('/reactivate/:id', verifyToken, authorize("admin"), reactivateForm)
router.delete('/delete/:id', verifyToken, authorize("admin"), deleteForm);
router.get('/responses/:id', verifyToken, authorize("admin"), getResponses);    
    
//user-routes
router.post('/fill-form/:id', verifyToken, authorize("admin", "user"), submitResponse);
export default router; 
