import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/assets/logo.png";
import Profile from "../components/assets/profile.png";
import { HiMiniBars3 } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import $ from "jquery";

const Header = () => {
  const [account, setAccount] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    profilePicture: null,
  });

  useEffect(() => {
    // Check for the token in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token and set the user data
        const decodedToken = jwtDecode(token);
        setUser({
          name: decodedToken.name,
          profilePicture: decodedToken.profilePicture,
        });
        setAccount(true); // Token exists, user is logged in
      } catch (error) {
        console.error("Invalid token", error);
        setAccount(false); // Invalid token, user is not logged in
      }
    } else {
      setAccount(false); // No token, user is not logged in
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout now?"
    );
    if (confirmLogout) {
      localStorage.removeItem("token"); // Remove the token from localStorage
      setAccount(false); // Set account state to false
      window.location.href = "/sigin"; // Redirect to the home
    }
  };

  const handleSideBar = () => {
    $(".main-container").css({ display: "block" });
    setTimeout(() => {
      $(".sideBar-container").css({ transform: "translateX(0%)" });
    }, 10);
  };

  const handleProfile = () => {
    $(".logout-container").toggle();
  };

  return (
    <div className="nav_container">
      <div className="left-field">
        <HiMiniBars3
          className="nav-toggle-btn"
          onClick={() => handleSideBar()}
        />
        <Link to="/" className="nav_logo">
          <img src={Logo} alt="Navbar logo" /> <h3>KEC_FMS</h3>
        </Link>
      </div>

      {account ? (
        <div className="notification_plus_login">
          <Link to="notification">
            <div className="notification">
              <IoNotificationsOutline className="icon" />
            </div>
          </Link>
          <span className="profile-field" onClick={handleProfile}>
            <div className="profile-image">
              <img src={Profile} alt="Default Profile" />
            </div>
            <p>
              {user.name} <IoIosArrowDown />
            </p>

            {account && (
              <div className="logout-container">
                <Link to="/profile">
                  <button>Profile</button>
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </span>
        </div>
      ) : (
        <div className="signin-signup">
          <Link to="signin">
            <button className="btn log primary" style={{ background: "#000" }}>
              Sign In
            </button>
          </Link>
          <Link to="signup">
            <button className="btn log primary" style={{ background: "#000" }}>
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
