import express from 'express';
import multer from 'multer';
import { ContentController } from './content.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();
const contentController = new ContentController();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB file size limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
        }
    }
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Document endpoints
router.get('/documents', contentController.getDocuments.bind(contentController));
router.post('/documents/upload', upload.single('file'), contentController.uploadDocument.bind(contentController));
router.post('/documents/check-plagiarism', contentController.checkPlagiarism.bind(contentController));
router.delete('/documents/:id', contentController.deleteDocument.bind(contentController));

// Resource endpoints
router.get('/resources', contentController.getResources.bind(contentController));
router.post('/resources', upload.single('file'), contentController.addResource.bind(contentController));
router.put('/resources/:id', contentController.updateResource.bind(contentController));
router.post('/resources/:id/reviews', contentController.addReview.bind(contentController));

export default router;