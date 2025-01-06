import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['textbook', 'video', 'article', 'course', 'tool', 'documentation'],
        required: true
    },
    provider: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null
    },
    filename: {
        type: String,
        trim: true
    },
    fileUrl: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    isFree: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

resourceSchema.index({ subject: 1, type: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ courseId: 1 });

export const Resource = mongoose.model('Resource', resourceSchema); 