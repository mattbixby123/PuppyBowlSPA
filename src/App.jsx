import React from 'react';
import NavBar from './components/NavBar'
// import NewPlayerForm from './components/NewPlayerForm'
import AllPlayers from './components/AllPlayers'
import SinglePlayer from './components/SinglePlayer'
import { Routes, Route } from 'react-router-dom';
import './App.css'


function App() {


  return (
    <>
      <h1>Bixby's Puppy Bowl</h1>
      <div className="NavBar">
      <NavBar />
      </div>
      <Routes>
        <Route path='/' element={<AllPlayers/>}/>
        <Route path="/players/:id" element={<SinglePlayer />} />
      </Routes>
    </>
  )
}

export default App
