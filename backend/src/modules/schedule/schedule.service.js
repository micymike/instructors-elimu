import { Event } from './schemas/schedule.schema';

export class ScheduleService {
    async createEvent(eventData) {
        const event = new Event(eventData);
        return await event.save();
    }

    async getEventsByMonth(instructorId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        return await Event.find({
            instructor: instructorId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('course', 'title')
            .populate('participants', 'firstName lastName email')
            .sort({ date: 1, startTime: 1 });
    }

    async updateEvent(eventId, updateData) {
        return await Event.findByIdAndUpdate(
            eventId,
            { $set: updateData },
            { new: true }
        );
    }

    async deleteEvent(eventId) {
        return await Event.findByIdAndDelete(eventId);
    }

    async getUpcomingEvents(instructorId, limit = 5) {
        const now = new Date();
        return await Event.find({
            instructor: instructorId,
            date: { $gte: now }
        })
            .sort({ date: 1, startTime: 1 })
            .limit(limit)
            .populate('course', 'title')
            .populate('participants', 'firstName lastName');
    }

    async getEventsByDateRange(instructorId, startDate, endDate) {
        return await Event.find({
            instructor: instructorId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 1, startTime: 1 });
    }
} 