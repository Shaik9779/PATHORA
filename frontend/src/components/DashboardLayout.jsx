
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./DashboardLayout.css";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/pathfinder": "Pathfinder",
  "/opportunities": "Opportunities",
  "/practice": "Practice Arena",
  "/network": "Network",
  "/roadmap": "My Roadmap",
  "/profile": "My Profile",
  "/settings": "Settings",
};

function DashboardLayout() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("pathora_token");
      const savedUser = sessionStorage.getItem("pathora_user");

      if (!token || !savedUser) {
        navigate("/login", { replace: true });
        return;
      }

      setUser(JSON.parse(savedUser));
    } catch {
      sessionStorage.removeItem("pathora_token");
      sessionStorage.removeItem("pathora_user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("pathora_token");
    sessionStorage.removeItem("pathora_user");
    navigate("/login", { replace: true });
  };

  if (!user) {
    return null;
  }

  const title = pageTitles[location.pathname] || "Workspace";

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-heading">
            <span className="dashboard-eyebrow">PATHORA WORKSPACE</span>
            <h1>{title}</h1>
          </div>

          <div className="dashboard-topbar-actions">
            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="Notifications"
              title="Notifications"
            >
              ♧
            </button>

            <div className="dashboard-user">
              <span className="dashboard-avatar">
                {(user.name || user.email || "U")
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </span>

              <div className="dashboard-user-details">
                <strong>{user.name || "Pathora user"}</strong>
                <span>{user.role || "student"}</span>
              </div>
            </div>

            <button
              type="button"
              className="dashboard-logout"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
