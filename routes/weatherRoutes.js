import { Router } from 'express';
import { getWeather } from '../controllers/weatherController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, getWeather);

export default router;
