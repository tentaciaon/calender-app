import React from 'react';

function EventList({ events, onDelete, onEdit }) {
  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>
          <h3>{event.title}</h3>
          <p>Date: {event.date}</p>
          <p>{event.description}</p>
          <button onClick={() => onEdit(event)}>Edit</button>
          <button onClick={() => onDelete(event.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default EventList;
