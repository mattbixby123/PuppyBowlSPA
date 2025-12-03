// SinglePlayer.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSinglePlayer, deletePlayer } from '../api';

const SinglePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    async function fetchPlayerDetails() {
      try {
        const playerData = await fetchSinglePlayer(id);
        setPlayer(playerData.data.player);
      } catch (error) {
        setError("Error fetching player details");
      }
    }
    fetchPlayerDetails();
  }, [id]);

  // Close lightbox on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowLightbox(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${player.name} from the team?`)) {
      try {
        setIsDeleting(true);
        await deletePlayer(id);
        navigate('/');
      } catch (error) {
        console.error("Error deleting player:", error);
        alert("Failed to delete player. Please try again.");
        setIsDeleting(false);
      }
    }
  };

  if (error) {
    return (
      <div className="singlePlayer">
        <div className="single-player-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-back" onClick={() => navigate('/')}>
            Back to Roster
          </button>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="singlePlayer">
      <img
        src={player.imageUrl}
        alt={player.name}
        onClick={() => setShowLightbox(true)}
        title="Click to view full size"
      />
      <div className="single-player-content">
        <h2>{player.name}</h2>
        <p>Breed: {player.breed}</p>

        {/* Additional player info if available */}
        {(player.status || player.teamId || player.cohortId) && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            {player.status && (
              <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
                <strong>Status:</strong> {player.status}
              </p>
            )}
            {player.teamId && (
              <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
                <strong>Team ID:</strong> {player.teamId}
              </p>
            )}
            {player.cohortId && (
              <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
                <strong>Cohort ID:</strong> {player.cohortId}
              </p>
            )}
          </div>
        )}

        <div className="single-player-actions">
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Removing...' : 'Remove from Team'}
          </button>
          <button
            className="btn-back"
            onClick={() => navigate('/')}
            disabled={isDeleting}
          >
            Back to Roster
          </button>
        </div>
      </div>

      {/* Image Lightbox */}
      {showLightbox && (
        <div className="lightbox-overlay" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setShowLightbox(false)}
              title="Close (ESC)"
            >
              ×
            </button>
            <img
              src={player.imageUrl}
              alt={player.name}
              className="lightbox-image"
            />
            <div className="lightbox-hint">
              Click outside or press ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePlayer;