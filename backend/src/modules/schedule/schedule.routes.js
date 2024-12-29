import express from 'express';
import { ScheduleController } from './schedule.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();
const scheduleController = new ScheduleController();

router.use(authMiddleware);

router.post('/', (req, res) => scheduleController.createEvent(req, res));
router.get('/', (req, res) => scheduleController.getMonthEvents(req, res));
router.get('/upcoming', (req, res) => scheduleController.getUpcomingEvents(req, res));
router.put('/:eventId', (req, res) => scheduleController.updateEvent(req, res));
router.delete('/:eventId', (req, res) => scheduleController.deleteEvent(req, res));

export default router; 