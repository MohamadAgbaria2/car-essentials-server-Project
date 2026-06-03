import { Router } from 'express';
import { getControls, updateControl, resetControls } from '../controllers/controlsController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/',      auth, getControls);
router.put('/',      auth, updateControl);
router.put('/reset', auth, resetControls);

export default router;
