import express from 'express';
import { ContentController } from './content.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();
const contentController = new ContentController();

router.use(authMiddleware);

router.get('/', (req, res) => contentController.getResources(req, res));
router.post('/', (req, res) => contentController.addResource(req, res));
router.put('/:id', (req, res) => contentController.updateResource(req, res));
router.post('/:id/reviews', (req, res) => contentController.addReview(req, res));

export default router; 