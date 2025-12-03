// AllPlayers.jsx

import React, { useState, useEffect } from "react";
import { fetchAllPlayers } from "../api/index";
import { Link } from "react-router-dom";
import NewPlayerForm from "./NewPlayerForm";

const AllPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [searchParam, setSearchParam] = useState('');
  const [sortBy, setSortBy] = useState('default'); // default, name-asc, name-desc, breed
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    getAllPlayers();
  }, []);

  const getAllPlayers = async () => {
    try {
      const APIResponse = await fetchAllPlayers();
      if (APIResponse && APIResponse.success) {
        setPlayers(APIResponse.data.players);
      } else {
        setError(APIResponse ? APIResponse.error.message : "Unknown error occurred");
      }
    } catch (error) {
      setError("Error fetching data");
    }
  };

  const handlePlayerAdded = () => {
    getAllPlayers();
    setShowPanel(false);
  };

  // Filter by search
  const filteredPlayers = searchParam
    ? players.filter((player) =>
      player.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      player.breed.toLowerCase().includes(searchParam.toLowerCase())
    )
    : players;

  // Sort players
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'breed':
        return a.breed.localeCompare(b.breed);
      default:
        return 0; // Keep original order
    }
  });

  return (
    <>
      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="searchBar">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by name or breed..."
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <span className="filter-label">Sort by:</span>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="breed">Breed</option>
          </select>
        </div>

        <button
          className="btn-add-player"
          onClick={() => setShowPanel(true)}
        >
          Add New Player
        </button>
      </div>

      {/* Players Grid */}
      <div className="playersGroup">
        {sortedPlayers.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon">🐕</div>
            <h2 className="empty-state-title">
              {searchParam ? 'No Players Found' : 'No Players Yet'}
            </h2>
            <p className="empty-state-text">
              {searchParam
                ? 'Try adjusting your search terms'
                : 'Add your first player to get started!'}
            </p>
          </div>
        ) : (
          sortedPlayers.map((player, index) => (
            <div key={player.id} className="player-card">
              <Link to={`/players/${player.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="player-image-container">
                  <img
                    src={player.imageUrl}
                    alt={player.name}
                    className="player-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400/3d7c1f/ffffff?text=' + player.name;
                    }}
                  />
                  <div className="player-number">{index + 1}</div>
                  <div className="player-name-overlay">
                    <h3 className="player-name">{player.name}</h3>
                    <p className="player-breed">{player.breed}</p>
                  </div>
                  <div className="player-details-hover">
                    <button type="button">See Details →</button>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Slide-out Panel */}
      {showPanel && (
        <>
          <div
            className="slide-panel-overlay"
            onClick={() => setShowPanel(false)}
          />
          <div className="slide-panel">
            <div className="slide-panel-header">
              <h2 className="slide-panel-title">Add New Player</h2>
              <button
                className="btn-close-panel"
                onClick={() => setShowPanel(false)}
              >
                ×
              </button>
            </div>
            <div className="slide-panel-body">
              <NewPlayerForm onPlayerAdded={handlePlayerAdded} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AllPlayers;