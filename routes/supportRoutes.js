import { Router } from 'express';
import { createTicket, getMyTickets, getTicketById, deleteTicket, filterTickets } from '../controllers/supportController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/',         auth, createTicket);
router.get('/',          auth, getMyTickets);
router.get('/filter',    auth, filterTickets);
router.get('/:id',       auth, getTicketById);
router.delete('/:id',    auth, deleteTicket);

export default router;
