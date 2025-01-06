import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import { CopyleaksCloud } from 'plagiarism-checker';
import streamifier from 'streamifier';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Resource Schema
const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    subject: { type: String, required: true },
    level: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    description: { type: String },
    provider: { type: String },
    url: { type: String },
    filename: { type: String },
    fileUrl: { type: String },
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);

// Document Schema
const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, default: 0 },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true }, // Cloudinary public ID
    plagiarismScore: { type: Number },
    plagiarismResults: { type: Object },
    downloadCount: { type: Number, default: 0 },
    description: String,
    tags: [String]
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

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
            // Handle file upload if present
            if (resourceData.file) {
                const file = resourceData.file;
                const uploadDir = path.join(process.cwd(), 'uploads', 'resources');
                
                // Ensure upload directory exists
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Generate unique filename
                const uniqueFilename = `${Date.now()}-${file.originalname}`;
                const filePath = path.join(uploadDir, uniqueFilename);

                // Save file
                await fs.promises.writeFile(filePath, file.buffer);

                // Update resource data with file information
                resourceData.filename = file.originalname;
                resourceData.fileUrl = `/uploads/resources/${uniqueFilename}`;
            }

            // Create and save resource
            const resource = new Resource({
                title: resourceData.filename || 'Untitled Resource',
                type: resourceData.type || 'article',
                subject: resourceData.subject || 'general',
                level: resourceData.level || 'beginner',
                courseId: resourceData.courseId || null,
                description: resourceData.description || 'No description provided',
                provider: 'Course Platform',
                url: resourceData.fileUrl || '',
                filename: resourceData.filename,
                fileUrl: resourceData.fileUrl
            });

            await resource.save();
            return resource;
        } catch (error) {
            console.error('Resource addition error:', error);
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

    async getDocuments({ search, type, priceRange, sortBy, instructorId }) {
        try {
            let query = { instructorId };
            
            // Search filter
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { tags: { $regex: search, $options: 'i' } }
                ];
            }
            
            // Type filter
            if (type && type !== 'all') {
                query.type = type;
            }
            
            // Price range filter
            if (priceRange && priceRange !== 'all') {
                switch(priceRange) {
                    case 'free':
                        query.price = 0;
                        break;
                    case 'paid':
                        query.price = { $gt: 0 };
                        break;
                    case 'under10':
                        query.price = { $lt: 10 };
                        break;
                    case 'over10':
                        query.price = { $gte: 10 };
                        break;
                }
            }
            
            // Sorting
            let sort = {};
            switch(sortBy) {
                case 'newest':
                    sort = { createdAt: -1 };
                    break;
                case 'oldest':
                    sort = { createdAt: 1 };
                    break;
                case 'priceAsc':
                    sort = { price: 1 };
                    break;
                case 'priceDesc':
                    sort = { price: -1 };
                    break;
                case 'downloads':
                    sort = { downloadCount: -1 };
                    break;
                default:
                    sort = { createdAt: -1 };
            }

            const documents = await Document.find(query).sort(sort);
            return documents;
        } catch (error) {
            console.error('Error in getDocuments:', error);
            throw error;
        }
    }

    async uploadDocument(documentData) {
        const { file, title, type, price, instructorId } = documentData;
        
        try {
            // Upload file to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    {
                        resource_type: 'raw',
                        folder: 'documents',
                        allowed_formats: ['pdf', 'doc', 'docx']
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });

            // Create document in MongoDB
            const document = await Document.create({
                title,
                type,
                price,
                instructorId,
                fileUrl: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                tags: documentData.tags || []
            });

            return document;
        } catch (error) {
            console.error('Error in uploadDocument:', error);
            throw error;
        }
    }

    async checkPlagiarism(documentId) {
        try {
            const document = await Document.findById(documentId);
            if (!document) {
                throw new Error('Document not found');
            }

            // Initialize plagiarism checker
            const copyleaks = new CopyleaksCloud(
                process.env.COPYLEAKS_EMAIL,
                process.env.COPYLEAKS_API_KEY
            );

            // Start plagiarism scan
            const scanId = await copyleaks.createByUrl(document.fileUrl);
            
            // Wait for results
            const results = await copyleaks.getResults(scanId);

            // Update document with plagiarism results
            document.plagiarismScore = results.score;
            document.plagiarismResults = results;
            await document.save();

            return results;
        } catch (error) {
            console.error('Error in checkPlagiarism:', error);
            throw error;
        }
    }

    async deleteDocument(id, instructorId) {
        try {
            const document = await Document.findOne({ _id: id, instructorId });
            if (!document) {
                return false;
            }

            // Delete file from Cloudinary
            if (document.publicId) {
                await cloudinary.v2.uploader.destroy(document.publicId, { resource_type: 'raw' });
            }

            // Delete document from MongoDB
            await document.deleteOne();
            return true;
        } catch (error) {
            console.error('Error in deleteDocument:', error);
            throw error;
        }
    }
}