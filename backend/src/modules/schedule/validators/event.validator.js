export const validateEvent = (eventData) => {
    const { title, date, startTime, endTime, type } = eventData;

    if (!title || title.trim().length === 0) {
        return 'Event title is required';
    }

    if (!date) {
        return 'Event date is required';
    }

    if (!startTime || !endTime) {
        return 'Start and end time are required';
    }

    if (type && !['class', 'meeting', 'workshop'].includes(type)) {
        return 'Invalid event type';
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return 'Invalid time format';
    }

    // Validate that end time is after start time
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
        return 'End time must be after start time';
    }

    return null;
}; 