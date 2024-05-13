// AllPlayers.jsx

import React, { useState, useEffect } from "react";
import { fetchAllPlayers } from "../api/index";
import { Link } from "react-router-dom";
import NewPlayerForm from "./NewPlayerForm";

const AllPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [searchParam, setSearchParam] = useState('');

  useEffect(() => {
    fetchAllPlayers();
  }, []); // Fetch players initially when component mounts

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
    // Refresh the list of players after a new player is added
    getAllPlayers();
  };

  const playersToDisplay = searchParam 
    ? players.filter((player) =>
        player.name.toLowerCase().includes(searchParam)
        )
    : players;

  return ( 
    <>
    <div className="searchBar">
      Search:{" "} 
      <input 
        type="text" 
        placeholder="search" 
        onChange={(e) => setSearchParam(e.target.value.toLowerCase())}
      />
    </div>

    <div className="NewPlayerForm">
      <NewPlayerForm onPlayerAdded={handlePlayerAdded} />
    </div>

    {playersToDisplay.map((player) => {
      return (
        <div key={player.id}>
          <h3>{player.name}</h3>
          <Link to={`/players/${player.id}`}>
            <button>See Details</button>
          </Link>
        </div>
      );
    })}
    </>
  );
}

export default AllPlayers;
