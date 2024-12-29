import { ScheduleService } from './schedule.service';
import { validateEvent } from './validators/event.validator';

export class ScheduleController {
    constructor() {
        this.scheduleService = new ScheduleService();
    }

    async createEvent(req, res) {
        try {
            const eventData = {
                ...req.body,
                instructor: req.user.id
            };

            const validationError = validateEvent(eventData);
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }

            const event = await this.scheduleService.createEvent(eventData);
            res.status(201).json(event);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create event' });
        }
    }

    async getMonthEvents(req, res) {
        try {
            const { month, year } = req.query;
            const events = await this.scheduleService.getEventsByMonth(
                req.user.id,
                parseInt(month),
                parseInt(year)
            );

            if (!events || events.length === 0) {
                return res.status(404).json({
                    message: 'No schedule at the moment',
                    events: []
                });
            }

            res.json(events);
        } catch (error) {
            res.status(404).json({
                message: 'No schedule at the moment',
                events: []
            });
        }
    }

    async updateEvent(req, res) {
        try {
            const { eventId } = req.params;
            const event = await this.scheduleService.updateEvent(eventId, req.body);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json(event);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update event' });
        }
    }

    async deleteEvent(req, res) {
        try {
            const { eventId } = req.params;
            const event = await this.scheduleService.deleteEvent(eventId);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json({ message: 'Event deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete event' });
        }
    }

    async getUpcomingEvents(req, res) {
        try {
            const events = await this.scheduleService.getUpcomingEvents(req.user.id);
            res.json(events);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch upcoming events' });
        }
    }
} 