import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active'],
    default: 'draft',
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true,
  },
  students: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  schedule: [{
    day: String,
    time: String,
  }],
  analytics: {
    completion_rate: { type: Number, default: 0 },
    avg_engagement: { type: Number, default: 0 },
    total_revenue: { type: Number, default: 0 },
    weekly_active_users: { type: Number, default: 0 },
    total_hours_watched: { type: Number, default: 0 },
  },
}, { timestamps: true });

export const Course = mongoose.model('Course', courseSchema); 