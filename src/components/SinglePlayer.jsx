import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSinglePlayer, deletePlayer } from '../api'; // Import fetchSinglePlayer and deletePlayer functions

const SinglePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State to store player details
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlayerDetails() {
      try {
        // Fetch player details based on id
        const playerData = await fetchSinglePlayer(id);
        // console.log("Player Data:", playerData); // Log playerData
        setPlayer(playerData.data.player);
      } catch (error) {
        setError("Error fetching player details");
      }
    }
    fetchPlayerDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePlayer(id);
      // Redirect to the players list after deletion
      navigate('/');
    } catch (error) {
      console.error("Error deleting player:", error);
      // Handle error, e.g., show error message to the user
    }
  };

  return (
    <div className="singlePlayer">
      {player ? (
        <>
          <img src={player.imageUrl} alt={player.name} />
          <h2>Name: {player.name}</h2>
          <p>Breed: {player.breed}</p>
          {/* Delete button */}
          <button onClick={handleDelete}>Delete</button>
          {/* Back button */}
          <button onClick={() => navigate('/')}>Back</button>
        </>
      ) : (
        <p>Loading player details...</p>
      )}
    </div>
  );
};

export default SinglePlayer;
