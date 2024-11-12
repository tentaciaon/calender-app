// src/components/EventModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Required for accessibility

function EventModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = () => {
    onSubmit({ title, description, media });
    setTitle('');
    setDescription('');
    setMedia(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Create Event</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Create Event</button>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
}

export default EventModal;
