import React from "react";
import { useState, useEffect } from "react";
import { PlusIcon, VideoIcon, CalendarIcon, LinkIcon } from "lucide-react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const WebinarSchedule = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    type: "webinar",
    platform: "zoom",
    link: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Mock fetching existing events
    const mockEvents = [
      {
        id: "1",
        title: "Introduction to React",
        start: new Date(2023, 5, 15, 14, 0),
        end: new Date(2023, 5, 15, 15, 0),
        type: "webinar",
        platform: "zoom",
        link: "https://zoom.us/j/1234567890",
      },
      {
        id: "2",
        title: "Advanced CSS Techniques",
        start: new Date(2023, 5, 20, 10, 0),
        end: new Date(2023, 5, 20, 11, 0),
        type: "class",
        platform: "meet",
        link: "https://meet.google.com/abc-defg-hij",
      },
    ];
    setEvents(mockEvents);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setNewEvent((prev) => ({ ...prev, [field]: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEventWithId = {
      ...newEvent,
      id: Date.now().toString(),
    };
    setEvents((prev) => [...prev, newEventWithId]);
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(),
      type: "webinar",
      platform: "zoom",
      link: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Event Scheduler</h1>

        {/* Calendar View */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectSlot={(slotInfo) => {
              setNewEvent((prev) => ({
                ...prev,
                start: slotInfo.start,
                end: slotInfo.end,
              }));
              setIsModalOpen(true);
            }}
            selectable
            className="text-blue-800"
          />
        </div>

        {/* Modal for scheduling new event */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Schedule New Event</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  placeholder="Event Title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start</label>
                    <input
                      type="datetime-local"
                      value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) => handleDateChange(new Date(e.target.value), "start")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End</label>
                    <input
                      type="datetime-local"
                      value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) => handleDateChange(new Date(e.target.value), "end")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <select
                  name="type"
                  value={newEvent.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="webinar">Webinar</option>
                  <option value="class">Class</option>
                  <option value="meeting">Meeting</option>
                </select>
                <select
                  name="platform"
                  value={newEvent.platform}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="zoom">Zoom</option>
                  <option value="meet">Google Meet</option>
                  <option value="custom">Custom Link</option>
                </select>
                <input
                  type="url"
                  name="link"
                  value={newEvent.link}
                  onChange={handleInputChange}
                  placeholder="Meeting Link"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Schedule Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List of upcoming events */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Upcoming Events</h2>
          <ul className="divide-y divide-gray-200">
            {events.map((event) => (
              <li key={event.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-blue-600">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      <CalendarIcon className="inline-block w-4 h-4 mr-1" />
                      {moment(event.start).format("MMMM D, YYYY [at] h:mm A")}
                    </p>
                    <p className="text-sm text-gray-500">
                      Type: {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Platform:{" "}
                      {event.platform === "custom" ? "Custom Link" : event.platform === "zoom" ? "Zoom" : "Google Meet"}
                    </p>
                  </div>
                  <div>
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-100 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <LinkIcon className="inline-block w-5 h-5 mr-2" />
                      Join
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WebinarSchedule;
