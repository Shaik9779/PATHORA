
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

const navigation = [
  {
    section: "WORKSPACE",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: "▦" },
      { label: "Pathfinder", path: "/pathfinder", icon: "⌖" },
      { label: "Opportunities", path: "/opportunities", icon: "▤" },
      { label: "Practice Arena", path: "/practice", icon: "⌘" },
      { label: "Network", path: "/network", icon: "♧" },
      { label: "Resume Builder", path: "/resume-builder", icon: "▤" },
    ],
  },
  {
    section: "PERSONAL",
    items: [
      { label: "My Profile", path: "/profile", icon: "◉" },
      { label: "Settings", path: "/settings", icon: "⚙" },
    ],
  },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {mobileOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={[
          "pathora-sidebar",
          collapsed ? "sidebar-collapsed" : "",
          mobileOpen ? "sidebar-mobile-open" : "",
        ].join(" ")}
      >
        <div className="sidebar-brand-row">
          <NavLink to="/" className="sidebar-brand">
            <span className="sidebar-brand-icon">P</span>
            {!collapsed && (
              <span className="sidebar-brand-name">
                pathora<span>.</span>
              </span>
            )}
          </NavLink>

          <button
            className="sidebar-mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            ×
          </button>

          <button
            className="sidebar-collapse-button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <div className="sidebar-nav">
          {navigation.map((group) => (
            <div className="sidebar-group" key={group.section}>
              {!collapsed && (
                <p className="sidebar-section-label">{group.section}</p>
              )}

              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                  }
                  end={item.path === "/dashboard"}
                >
                  <span className="sidebar-link-icon" aria-hidden="true">
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="sidebar-link-label">{item.label}</span>
                  )}

                  {item.path === "/opportunities" && !collapsed && (
                    <span className="sidebar-new-badge">Explore</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {!collapsed && (
          <div className="sidebar-bottom">
            <div className="sidebar-tip-icon">✦</div>
            <p className="sidebar-tip-title">Small steps. Big future.</p>
            <p className="sidebar-tip-description">
              Keep moving toward your career goals, one task at a time.
            </p>
          </div>
        )}
      </aside>

      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        ☰
      </button>
    </>
  );
}

export default Sidebar;
