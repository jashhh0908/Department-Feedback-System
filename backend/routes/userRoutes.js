import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middleware.js';
import { submitResponse } from '../controllers/responseController.js';
import { getFormById } from '../controllers/formController.js';

const router = express.Router();

router.post('/fill-form/:id', verifyToken, authorize("user"), submitResponse);
router.get('/get/:id', verifyToken, authorize("user"), getFormById);

export default router;