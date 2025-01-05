import express from 'express';
import { ContentController } from './content.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();
const contentController = new ContentController();

router.use(authMiddleware);

router.get('/resources', (req, res) => contentController.getResources(req, res));
router.post('/resources', (req, res) => contentController.addResource(req, res));
router.put('/resources/:id', (req, res) => contentController.updateResource(req, res));
router.post('/resources/:id/reviews', (req, res) => contentController.addReview(req, res));

export default router; 