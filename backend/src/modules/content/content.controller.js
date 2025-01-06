import { ContentService } from './content.service';

export class ContentController {
    constructor() {
        this.contentService = new ContentService();
    }

    // Document endpoints
    async getDocuments(req, res) {
        try {
            const { search, type, priceRange, sortBy } = req.query;
            const documents = await this.contentService.getDocuments({
                search,
                type,
                priceRange,
                sortBy,
                instructorId: req.user._id // MongoDB ObjectId
            });

            res.json(documents);
        } catch (error) {
            console.error('Error fetching documents:', error);
            res.status(500).json({
                message: 'Failed to fetch documents',
                error: error.message
            });
        }
    }

    async uploadDocument(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const documentData = {
                file: req.file,
                title: req.body.title,
                type: req.body.type,
                price: parseFloat(req.body.price) || 0,
                instructorId: req.user._id,
                tags: req.body.tags ? JSON.parse(req.body.tags) : []
            };

            const document = await this.contentService.uploadDocument(documentData);
            res.status(201).json(document);
        } catch (error) {
            console.error('Document upload error:', error);
            res.status(500).json({
                message: 'Failed to upload document',
                error: error.message
            });
        }
    }

    async checkPlagiarism(req, res) {
        try {
            const { documentId } = req.body;
            if (!documentId) {
                return res.status(400).json({ message: 'Document ID is required' });
            }

            const result = await this.contentService.checkPlagiarism(documentId);
            res.json(result);
        } catch (error) {
            console.error('Plagiarism check error:', error);
            res.status(500).json({
                message: 'Failed to check plagiarism',
                error: error.message
            });
        }
    }

    async deleteDocument(req, res) {
        try {
            const { id } = req.params;
            const instructorId = req.user._id;

            const deleted = await this.contentService.deleteDocument(id, instructorId);
            
            if (!deleted) {
                return res.status(404).json({ message: 'Document not found or unauthorized' });
            }

            res.json({ message: 'Document deleted successfully' });
        } catch (error) {
            console.error('Document deletion error:', error);
            res.status(500).json({
                message: 'Failed to delete document',
                error: error.message
            });
        }
    }

    async getResources(req, res) {
        try {
            const { type, level, subject, isFree, search } = req.query;
            const resources = await this.contentService.getResources({
                type,
                level,
                subject,
                isFree,
                search
            });

            if (!resources || resources.length === 0) {
                return res.status(404).json({
                    message: 'No learning resources available at the moment',
                    resources: []
                });
            }

            res.json(resources);
        } catch (error) {
            res.status(404).json({
                message: 'No learning resources available at the moment',
                resources: []
            });
        }
    }

    async addResource(req, res) {
        try {
            // Include courseId in the resource creation
            const resourceData = {
                ...req.body,
                courseId: req.body.courseId || null,
                file: req.file  // Assuming you're using multer for file upload
            };

            const resource = await this.contentService.addResource(resourceData);
            res.status(201).json(resource);
        } catch (error) {
            console.error('Resource addition error:', error);
            res.status(500).json({ 
                message: 'Failed to add resource', 
                error: error.message 
            });
        }
    }

    async updateResource(req, res) {
        try {
            const resource = await this.contentService.updateResource(req.params.id, req.body);
            if (!resource) {
                return res.status(404).json({ message: 'Resource not found' });
            }
            res.json(resource);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update resource' });
        }
    }

    async addReview(req, res) {
        try {
            const resource = await this.contentService.addReview(req.params.id, {
                user: req.user._id,
                ...req.body
            });
            res.json(resource);
        } catch (error) {
            res.status(500).json({ message: 'Failed to add review' });
        }
    }
} 