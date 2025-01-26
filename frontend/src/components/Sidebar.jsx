import React, { useState } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import Logo from "../components/assets/logo.png";
import { IoCloseOutline } from "react-icons/io5";
import { RiDashboardFill } from "react-icons/ri";
import { IoHome } from "react-icons/io5";
import { BsSlack } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { TbLogin } from "react-icons/tb";
import { FaUserCircle } from "react-icons/fa";

const SideBar = () => {
  const handleSideBar = () => {
    setTimeout(() => {
      $(".main-container").css({ display: "none" });
    }, 200);
    $(".sideBar-container").css({ transform: "translateX(-200%)" });
  };
  const [account, setAccount] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout now?"
    );
  };

  return (
    <div
      className="main-container"
      onClick={() => {
        handleSideBar();
      }}
    >
      <div className="sideBar-container">
        <div className="close-icon-div">
          <div className="nav_logo">
            <img src={Logo} alt="logo" />
            <h3>KEC_FMS</h3>
          </div>
          <IoCloseOutline
            className="close-icon"
            onClickCapture={() => handleSideBar()}
          />
        </div>
        <hr />
        <div className="child-container">
          <div className="categories">
            <ul>
              {account && (
                <Link
                  to="admindashboard"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <li>
                    <RiDashboardFill className="icons" /> AdminDashboard
                  </li>
                </Link>
              )}
              {account && user.role === "admin" && (
                <Link
                  to="dashboard"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <li>
                    <RiDashboardFill className="icons" /> Dashboard
                  </li>
                </Link>
              )}
              <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>
                <li>
                  <IoHome className="icons" />
                  Home
                </li>
              </Link>
              {account && user.role === "admin" && (
                <Link
                  to="addevent"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <li>
                    <BsSlack className="icons" /> Post Event
                  </li>
                </Link>
              )}
              {account && (
                <>
                  <Link
                    to="notification"
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <li>
                      <IoNotifications className="icons" /> Notification
                    </li>
                  </Link>
                  <Link
                    to="/profile"
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <li>
                      <FaUserCircle className="icons" />
                      Profile
                    </li>
                  </Link>

                  <li onClick={() => handleLogout()}>
                    <TbLogout className="icons" />
                    Logout
                  </li>
                </>
              )}
              {!account && (
                <>
                  <Link
                    to="signin"
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <li>
                      <TbLogin className="icons" /> Sign In
                    </li>
                  </Link>
                  <Link
                    to="signup"
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <li>
                      <TbLogin className="icons" /> Sign Up
                    </li>
                  </Link>
                </>
              )}
              {/* Add the new link to the File Upload page */}
              <Link
                to="/upload"
                style={{ textDecoration: "none", color: "#fff" }}
              >
                <li>
                  <BsSlack className="icons" /> File Upload
                </li>
              </Link>
            </ul>
          </div>
        </div>
        <div className="empty-container"></div>
      </div>
    </div>
  );
};

export default SideBar;
