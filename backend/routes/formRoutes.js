import express from "express";
import { createForm, deactivateForm, deleteForm, getArchivedForm, getForm, getFormById, reactivateForm, toggleFormStatus, updateForm } from "../controllers/formController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { getResponses, submitResponse } from "../controllers/responseController.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

//admin-routes
router.post('/create', verifyToken, authorize("admin", "super-admin"), createForm);
router.get('/get', verifyToken, authorize("admin", "super-admin"), getForm);
router.get('/get/:id', verifyToken, authorize("admin", "super-admin"), getFormById);
router.get('/get-archived', verifyToken, authorize("admin", "super-admin"), getArchivedForm);
router.put('/update/:id', verifyToken, authorize("admin", "super-admin"), updateForm);
router.post('/toggle/:id', verifyToken, authorize("admin", "super-admin"), toggleFormStatus);
router.post('/deactivate/:id', verifyToken, authorize("admin", "super-admin"), deactivateForm);
router.post('/reactivate/:id', verifyToken, authorize("admin", "super-admin"), reactivateForm)
router.delete('/delete/:id', verifyToken, authorize("admin", "super-admin"), deleteForm);
router.get('/responses/:id', verifyToken, authorize("admin", "super-admin"), getResponses);    
    
//user-routes
router.post('/fill-form/:id', verifyToken, authorize("admin", "super-admin", "user"), submitResponse);

//analytics 
router.get('/:id/analytics', verifyToken, authorize("admin", "super-admin"), getAnalytics);
export default router; 
