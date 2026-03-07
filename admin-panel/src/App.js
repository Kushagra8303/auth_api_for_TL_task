import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

import "./App.css";

function App() {

  return (

    <BrowserRouter>

      <div className="app-container">

        <div className="sidebar">
          <Sidebar/>
        </div>

        <div className="main-content">

          <Navbar/>

          <div className="page-content">

            <Routes>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/users" element={<Users/>}/>
            </Routes>

          </div>

        </div>

      </div>

    </BrowserRouter>

  );
}

export default App;