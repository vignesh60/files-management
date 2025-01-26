// src/components/Sidebar.js
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li><Link to="/">File Management</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
