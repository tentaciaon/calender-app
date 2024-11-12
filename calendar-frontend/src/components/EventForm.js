import React, { useState } from 'react';
import '.components/EventForm.css'; // Import the CSS file for styling

function EventForm({ onSubmit, initialEvent = {} }) {
  const [title, setTitle] = useState(initialEvent.title || '');
  const [date, setDate] = useState(initialEvent.date || '');
  const [description, setDescription] = useState(initialEvent.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, date, description });
    setTitle('');
    setDate('');
    setDescription('');
  };

  return (
    <div className="form-container">
      <h2>Create / Edit Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">Save Event</button>
      </form>
    </div>
  );
}

export default EventForm;
