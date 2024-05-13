// NewPlayerForm.jsx

import React, { useState } from 'react';
import { createPlayer } from '../api';

const NewPlayerForm = ({ onPlayerAdded }) => { // Pass a callback to handle new player addition
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      // Handle error, e.g., display an error message to the user
    }
  };

  return (
    <div>
      <h2>Add New Player</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Breed:
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewPlayerForm;
