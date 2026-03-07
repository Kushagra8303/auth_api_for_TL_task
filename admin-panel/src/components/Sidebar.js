import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{
      width:"220px",
      height:"100vh",
      background:"#1e293b",
      color:"white",
      padding:"20px"
    }}>
      <h2>Admin Panel</h2>

      <ul style={{listStyle:"none",padding:0}}>
        <li style={{margin:"20px 0"}}>
          <Link to="/" style={{color:"white",textDecoration:"none"}}>Dashboard</Link>
        </li>

        <li>
          <Link to="/users" style={{color:"white",textDecoration:"none"}}>Users</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;