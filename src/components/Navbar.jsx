
// import { useEffect, useState } from "react";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import "./Navbar.css";

// function Navbar() {
//   const [user, setUser] = useState(null);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Refresh the user state after login or navigation.
//   useEffect(() => {
//     try {
//       const savedUser = sessionStorage.getItem("pathora_user");
//       const token = sessionStorage.getItem("pathora_token");

//       if (savedUser && token) {
//         setUser(JSON.parse(savedUser));
//       } else {
//         setUser(null);
//       }
//     } catch {
//       setUser(null);
//     }

//     setMenuOpen(false);
//   }, [location.pathname]);

//   const handleLogout = () => {
//     sessionStorage.removeItem("pathora_token");
//     sessionStorage.removeItem("pathora_user");

//     setUser(null);
//     setMenuOpen(false);
//     navigate("/");
//   };

//   const navLinks = [
//     { name: "Home", path: "/" },
//     { name: "Pathfinder", path: "/pathfinder" },
//     { name: "Practice", path: "/practice" },
//     { name: "Network", path: "/network" },
//   ];

//   return (
//     <header className="pathora-navbar">
//       <div className="navbar-container">
//         <Link to="/" className="navbar-brand">
//           <span className="brand-icon">P</span>
//           <span>pathora<span className="brand-dot">.</span></span>
//         </Link>

//         <nav className="navbar-links">
//           {navLinks.map((link) => (
//             <NavLink
//               key={link.path}
//               to={link.path}
//               end={link.path === "/"}
//               className={({ isActive }) =>
//                 `navbar-link ${isActive ? "active" : ""}`
//               }
//             >
//               {link.name}
//             </NavLink>
//           ))}
//         </nav>

//         <div className="navbar-actions">
//           {!user ? (
//             <>
//               <Link to="/login" className="navbar-login">
//                 Log in
//               </Link>

//               <Link to="/signup" className="navbar-signup">
//                 Get started <span>↗</span>
//               </Link>
//             </>
//           ) : (
//             <div className="profile-wrapper">
//               <button
//                 type="button"
//                 className="profile-trigger"
//                 onClick={() => setMenuOpen((open) => !open)}
//                 aria-expanded={menuOpen}
//                 aria-label="Open profile menu"
//               >
//                 <span className="profile-avatar">
//                   {(user.name || user.email || "U")
//                     .trim()
//                     .charAt(0)
//                     .toUpperCase()}
//                 </span>

//                 <span className="profile-name">
//                   {user.name || "My account"}
//                 </span>

//                 <span className="profile-chevron">
//                   {menuOpen ? "▲" : "▼"}
//                 </span>
//               </button>

//               {menuOpen && (
//                 <div className="profile-dropdown">
//                   <div className="profile-details">
//                     <strong>{user.name || "Pathora user"}</strong>
//                     <span>{user.email}</span>
//                   </div>

//                   <div className="dropdown-divider" />

//                   <Link
//                     to="/profile"
//                     className="dropdown-item"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     My profile
//                   </Link>

//                   <button
//                     type="button"
//                     className="dropdown-item logout-button"
//                     onClick={handleLogout}
//                   >
//                     Log out
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Navbar;
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem("pathora_user");
      const token = sessionStorage.getItem("pathora_token");

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }

    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("pathora_token");
    sessionStorage.removeItem("pathora_user");

    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Pathfinder", path: "/pathfinder" },
    { name: "Practice", path: "/practice" },
    { name: "Network", path: "/network" },
  ];

  return (
    <header className="pathora-navbar">
      <div className="navbar-container">
        {/* PATHORA BRAND */}
        <Link
          to="/"
          className="navbar-brand"
          aria-label="PATHORA home"
        >
          <span className="brand-icon" aria-hidden="true">
            P
          </span>

          <span className="brand-name">PATHORA</span>
        </Link>

        {/* MAIN NAVIGATION */}
        <nav className="navbar-links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* USER ACTIONS */}
        <div className="navbar-actions">
          {!user ? (
            <>
              <Link to="/login" className="navbar-login">
                Log in
              </Link>

              <Link to="/signup" className="navbar-signup">
                Get started <span aria-hidden="true">↗</span>
              </Link>
            </>
          ) : (
            <div className="profile-wrapper">
              <button
                type="button"
                className="profile-trigger"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-label="Open profile menu"
              >
                <span className="profile-avatar">
                  {(user.name || user.email || "U")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </span>

                <span className="profile-name">
                  {user.name || "My account"}
                </span>

                <span className="profile-chevron" aria-hidden="true">
                  {menuOpen ? "▲" : "▼"}
                </span>
              </button>

              {menuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-details">
                    <strong>{user.name || "Pathora user"}</strong>
                    <span>{user.email}</span>
                  </div>

                  <div className="dropdown-divider" />

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    My profile
                  </Link>

                  <button
                    type="button"
                    className="dropdown-item logout-button"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
