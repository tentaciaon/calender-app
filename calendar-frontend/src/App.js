import React, { useState, useEffect } from 'react';
import CalendarView from './components/CalendarView';
import EventModal from './components/EventModal';
import EventList from './components/EventList';
import './App.css';
import './components/CalendarView.css';
import './components/EventModal.css';
import gsap from 'gsap';

function App() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    gsap.fromTo(".calendar-day", { opacity: 0 }, { opacity: 1, duration: 0.5 });
  }, []);

  // Fetch initial events from the backend
  useEffect(() => {
    fetch('/events')
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  // Request Notification Permission
  const requestNotificationPermission = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEditingEvent(null); // Clear any editing state when clicking on a new date
    setModalOpen(true);
  };

  const handleEventSubmit = (event) => {
    if (!event.title || !event.date || !event.time) {
      alert('Please fill in all required fields: Title, Date, and Time.');
      return;
    }

    if (editingEvent) {
      // Update existing event
      fetch(`/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingEvent, ...event, date: selectedDate.toISOString() }),
      })
        .then((res) => res.json())
        .then((updatedEvent) => {
          setEvents((prev) =>
            prev.map((e) => (e.id === editingEvent.id ? updatedEvent : e))
          );
          setEditingEvent(null); // Clear editing state after update
        })
        .catch((error) => console.error('Error updating event:', error));
    } else {
      // Create a new event
      fetch('/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...event, date: selectedDate.toISOString() }),
      })
        .then((res) => res.json())
        .then((newEvent) => setEvents((prev) => [...prev, newEvent]))
        .catch((error) => console.error('Error creating event:', error));
    }
    setModalOpen(false);
  };

  const deleteEvent = (id) => {
    fetch(`/events/${id}`, { method: 'DELETE' })
      .then(() => setEvents((prev) => prev.filter((event) => event.id !== id)))
      .catch((error) => console.error('Error deleting event:', error));
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setSelectedDate(new Date(event.date));
    setModalOpen(true);
  };

  // Filter events based on search query and filter options
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType ? event.type === filterType : true;
    const matchesDate = filterDate ? event.date === filterDate : true;

    return matchesSearch && matchesType && matchesDate;
  });

  // Schedule Notification for Event
  const scheduleNotification = (event) => {
    const triggerDate = new Date(event.date);
    const triggerTime = new Date(event.time);
    triggerDate.setHours(triggerTime.getHours(), triggerTime.getMinutes());

    const timeUntilEvent = triggerDate - new Date();

    if (timeUntilEvent > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          const notification = new Notification(event.title, {
            body: event.description,
            icon: '/icon.png', // Add an icon if you want
          });

          // Add event listener for notification actions (Dismiss / Snooze)
          notification.onclick = (e) => {
            e.preventDefault();
            console.log("Notification clicked.");
          };

          notification.onclose = () => {
            console.log("Notification closed.");
          };
        }
      }, timeUntilEvent);
    }
  };

  // Call scheduleNotification for each event
  useEffect(() => {
    events.forEach((event) => {
      scheduleNotification(event);
    });
  }, [events]);

  return (
    <div>
      <h1>Event Manager & Calendar</h1>
      <CalendarView events={events} onDateClick={handleDateClick} />

      <div className="filters">
        <input
          type="text"
          placeholder="Search Events"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Filter by Type</option>
          <option value="text">Text</option>
          <option value="video">Video</option>
          <option value="picture">Picture</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          placeholder="Filter by Date"
        />
      </div>

      <EventList
        events={filteredEvents}
        onDelete={deleteEvent}
        onEdit={handleEdit}
      />

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleEventSubmit}
        initialEvent={editingEvent}
      />
    </div>
  );
}

export default App;
