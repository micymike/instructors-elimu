import { Resource } from './schemas/resource.schema';

export class ContentService {
    async getResources(filters) {
        try {
            let query = {};

            if (filters.type && filters.type !== 'all') {
                query.type = filters.type;
            }

            if (filters.level && filters.level !== 'all') {
                query.level = filters.level;
            }

            if (filters.subject && filters.subject !== 'all') {
                query.subject = filters.subject;
            }

            if (filters.isFree && filters.isFree !== 'all') {
                query.isFree = filters.isFree === 'true';
            }

            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } },
                    { tags: { $in: [new RegExp(filters.search, 'i')] } }
                ];
            }

            const resources = await Resource.find(query)
                .sort({ rating: -1, createdAt: -1 })
                .limit(50);

            return resources;
        } catch (error) {
            throw new Error('Failed to fetch resources');
        }
    }

    async addResource(resourceData) {
        try {
            const resource = new Resource(resourceData);
            await resource.save();
            return resource;
        } catch (error) {
            throw new Error('Failed to add resource');
        }
    }

    async updateResource(id, updateData) {
        try {
            const resource = await Resource.findByIdAndUpdate(id, updateData, { new: true });
            return resource;
        } catch (error) {
            throw new Error('Failed to update resource');
        }
    }

    async addReview(resourceId, reviewData) {
        try {
            const resource = await Resource.findById(resourceId);
            resource.reviews.push(reviewData);

            // Update average rating
            const totalRating = resource.reviews.reduce((sum, review) => sum + review.rating, 0);
            resource.rating = totalRating / resource.reviews.length;

            await resource.save();
            return resource;
        } catch (error) {
            throw new Error('Failed to add review');
        }
    }
} 