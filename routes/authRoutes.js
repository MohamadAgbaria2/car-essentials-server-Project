import { Router } from 'express';
import { register, login, getMe, updateMe, deleteMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        auth, getMe);
router.put('/me',        auth, updateMe);
router.delete('/me',     auth, deleteMe);

export default router;
