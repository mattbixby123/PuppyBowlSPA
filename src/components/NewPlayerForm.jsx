// NewPlayerForm.jsx

import React, { useState } from 'react';
import { createPlayer } from '../api';

const NewPlayerForm = ({ onPlayerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.breed.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await createPlayer(formData);

      // Clear form fields after submission
      setFormData({
        name: '',
        breed: '',
      });

      // Call the callback to inform parent component of new player addition
      onPlayerAdded();
    } catch (error) {
      console.error('Error creating player:', error);
      setError('Failed to add player. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="NewPlayerForm">
      <h2>Player Information</h2>
      <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        Fill in the details below to add a new player to the team.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Player Name <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter player name..."
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="breed">
            Breed <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            id="breed"
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="Enter breed..."
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Player...' : 'Add to Team'}
        </button>
      </form>
    </div>
  );
};

export default NewPlayerForm;