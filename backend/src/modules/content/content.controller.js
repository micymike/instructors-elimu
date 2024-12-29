import { ContentService } from './content.service';

export class ContentController {
    constructor() {
        this.contentService = new ContentService();
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
            const resource = await this.contentService.addResource(req.body);
            res.status(201).json(resource);
        } catch (error) {
            res.status(500).json({ message: 'Failed to add resource' });
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
                user: req.user.id,
                ...req.body
            });
            res.json(resource);
        } catch (error) {
            res.status(500).json({ message: 'Failed to add review' });
        }
    }
} 