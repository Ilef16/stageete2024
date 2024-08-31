import React, { useEffect, useState } from "react";
import { Logo, SmallLogo, LogoWhite, Avatar1, Logout } from "../../EntryFile/imagePath";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const email = localStorage.getItem('email');


  // Handle Sidebar Toggle
  const handleSidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    setToggle((prev) => !prev);
  };

  // Expand/Collapse Menu
  const expandMenu = () => document.body.classList.remove("expand-menu");
  const expandMenuOpen = () => document.body.classList.add("expand-menu");

  // Sidebar Overlay Toggle
  const sidebarOverlay = () => {
    document.querySelector(".main-wrapper").classList.toggle("slide-nav");
    document.querySelector(".sidebar-overlay").classList.toggle("opened");
    document.querySelector("html").classList.toggle("menu-opened");
  };

  // Fullscreen Toggle
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = (elem) => {
    elem = elem || document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  // Fetch Username and Role from Local Storage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRoles = JSON.parse(localStorage.getItem("roles")) || [];
    
    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedRoles.length > 0) {
      // Assuming roles array contains roles like ["ROLE_ADMIN", "employee", "Role_MANAGER"]
      const roleMapping = {
        "ROLE_ADMIN": "Admin",
        "employee": "Employee",
        "Role_MANAGER": "Manager",
      };

      // Set the first role or default to "User" if none of the predefined roles match
      setRole(roleMapping[storedRoles[0]] || "User");
    }
  }, []);

  return (
    <div className="header">
      {/* Logo */}
      <div
        className={`header-left ${toggle ? "" : "active"}`}
        onMouseLeave={expandMenu}
        onMouseOver={expandMenuOpen}
      >
        <Link to="/dream-pos/dashboard" className="logo logo-normal">
          <img src={Logo} alt="Logo" />
        </Link>
        <Link to="/dream-pos/dashboard" className="logo logo-white">
          <img src={LogoWhite} alt="Logo White" />
        </Link>
        <Link to="/dream-pos/dashboard" className="logo-small">
          <img src={SmallLogo} alt="Logo Small" />
        </Link>
        <Link id="toggle_btn" to="#" onClick={handleSidebar}>
          <FeatherIcon icon="chevrons-left" className="feather-16" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <Link
        id="mobile_btn"
        className="mobile_btn"
        to="#"
        onClick={sidebarOverlay}
      >
        <span className="bar-icon">
          <span />
          <span />
          <span />
        </span>
      </Link>

      <ul className="nav user-menu">
        <li className="nav-item nav-searchinputs">
          {/* Add search input if needed */}
        </li>
        <li className="nav-item dropdown has-arrow main-drop">
          <Link
            to="#"
            className="dropdown-toggle nav-link userset"
            data-bs-toggle="dropdown"
          >
            <span className="user-info">
              <span className="user-letter">
                <img src={Avatar1} alt="Avatar" className="img-fluid" />
              </span>
              <span className="user-detail">
                <span className="user-name">{username}</span>
                <span className="user-role">{role}</span>
              </span>
            </span>
          </Link>
          <div className="dropdown-menu menu-drop-user">
            <div className="profilename">
              <div className="profileset">
                <span className="user-img">
                  <img src={Avatar1} alt="Avatar" />
                  <span className="status online" />
                </span>
                <div className="profilesets">
                  <h6>{username}</h6>
                  <h5>{role}</h5>
                </div>
              </div>
              <hr className="m-0" />
              <Link className="dropdown-item logout pb-0" to="/signIn">
                <img src={Logout} className="me-2" alt="Logout" />
                Logout
              </Link>
            </div>
          </div>
        </li>
      </ul>

      {/* Mobile Menu */}
      <div className="dropdown mobile-user-menu">
        <Link
          to="#"
          className="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa fa-ellipsis-v" />
        </Link>
        <div className="dropdown-menu dropdown-menu-right">
          <Link className="dropdown-item" to="/signIn">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
