import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['class', 'meeting', 'workshop'],
        default: 'class'
    },
    description: {
        type: String,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    zoomMeetingId: {
        type: String
    },
    recurringEvent: {
        isRecurring: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
        },
        endDate: {
            type: Date
        }
    },
    notifications: {
        reminderSent: {
            type: Boolean,
            default: false
        },
        reminderTime: {
            type: Number, // minutes before event
            default: 30
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
eventSchema.index({ date: 1, instructor: 1 });
eventSchema.index({ course: 1 });

export const Event = mongoose.model('Event', eventSchema); 