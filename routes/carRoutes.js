import { Router } from 'express';
import { getCar, updateCar, updateTelemetry, getCarStats } from '../controllers/carController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/',           auth, getCar);
router.put('/',           auth, updateCar);
router.put('/telemetry',  auth, updateTelemetry);
router.get('/stats',      auth, getCarStats);

export default router;
