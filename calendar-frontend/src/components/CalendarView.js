// src/components/CalendarView.js
import React, { useState } from 'react';
import Calendar from 'react-calendar'; // or import FullCalendar from '@fullcalendar/react';
import 'react-calendar/dist/Calendar.css'; // Include CSS for styling

function CalendarView({ events, onDateClick }) {
  // Destructure useState correctly
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateClick(date); // Pass the date to the parent component
  };

  return (
    <div>
      <Calendar
        onClickDay={handleDateClick}
        value={selectedDate} // Display the currently selected date
        tileContent={({ date }) =>
          events
            .filter((event) => new Date(event.date).toDateString() === date.toDateString())
            .map((event, index) => (
              <div key={index} style={{ backgroundColor: '#FFD700', marginTop: '2px' }}>
                {event.title}
              </div>
            ))
        }
      />
    </div>
  );
}

export default CalendarView;
