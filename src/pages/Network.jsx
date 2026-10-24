
import { useCallback, useEffect, useMemo, useState } from "react";
import "./Network.css";

const API_BASE = (
  import.meta.env.VITE_API_URL || "https://pathora-1.onrender.com"
).replace(/\/$/, "");

const TABS = [
  { id: "discover", label: "Discover" },
  { id: "incoming", label: "Received", count: true },
  { id: "sent", label: "Sent" },
  { id: "connected", label: "My network" },
];

function getInitials(name = "Pathora Member") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(name = "") {
  const colors = ["violet", "blue", "teal", "rose", "amber"];
  const total = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[total % colors.length];
}

function normalizeRole(role) {
  if (!role) return "Pathora member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function getErrorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}

function Network() {
  const [activeTab, setActiveTab] = useState("discover");
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [connected, setConnected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const token = sessionStorage.getItem("pathora_token");

  const request = useCallback(
    async (path, options = {}) => {
      if (!token) {
        throw new Error("Please log in to use Pathora Network.");
      }

      const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Your session may have expired. Please log in again.");
        }
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      return data;
    },
    [token]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadNetwork() {
      setLoading(true);
      setError("");

      try {
        const views = ["discover", "incoming", "sent", "connected"];

        const results = await Promise.all(
          views.map((view) =>
            request(`/api/connections?view=${view}`)
          )
        );

        if (cancelled) return;

        setMembers(Array.isArray(results[0].users) ? results[0].users : results[0].connections || []);
        setIncoming(Array.isArray(results[1].requests) ? results[1].requests : results[1].connections || []);
        setSent(Array.isArray(results[2].requests) ? results[2].requests : results[2].connections || []);
        setConnected(Array.isArray(results[3].connections) ? results[3].connections : []);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Couldn't load your network."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadNetwork();

    return () => {
      cancelled = true;
    };
  }, [request, refreshKey]);

  const pendingUserIds = useMemo(
    () => new Set(sent.map((item) => String(item.receiverId ?? item.user?.id ?? item.id))),
    [sent]
  );

  const connectedUserIds = useMemo(
    () => new Set(connected.map((item) => String(item.user?.id ?? item.id))),
    [connected]
  );

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return members;

    return members.filter((member) => {
      const searchable = [
        member.name,
        member.role,
        member.headline,
        member.college,
        member.skills?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [members, search]);

  async function sendRequest(userId) {
    setBusyId(String(userId));
    setError("");
    setNotice("");

    try {
      await request("/api/connections", {
        method: "POST",
        body: JSON.stringify({ receiverId: userId }),
      });

      setNotice("Connection request sent.");
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't send the request."));
    } finally {
      setBusyId(null);
    }
  }

  async function respondToRequest(connectionId, status) {
    setBusyId(String(connectionId));
    setError("");
    setNotice("");

    try {
      await request(`/api/connections/${connectionId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setNotice(
        status === "accepted"
          ? "You're now connected!"
          : "Connection request declined."
      );

      setRefreshKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't update the request."));
    } finally {
      setBusyId(null);
    }
  }

  function getMemberState(member) {
    const id = String(member.id);

    if (connectedUserIds.has(id)) return "connected";
    if (pendingUserIds.has(id)) return "pending";

    if (member.connectionStatus === "pending") return "pending";
    if (member.connectionStatus === "connected") return "connected";

    return "available";
  }

  function renderMemberCard(member, view = "discover") {
    const person = member.user || member;
    const id = person.id;
    const name = person.name || "Pathora Member";
    const role = normalizeRole(person.role);
    const skills = Array.isArray(person.skills) ? person.skills : [];
    const state = getMemberState(person);
    const isBusy = busyId === String(id);

    return (
      <article className="network-card" key={member.id ?? id}>
        <div className="network-card-cover">
          <span className="network-profile-label">PATHORA MEMBER</span>
          <div className={`network-avatar ${getAvatarColor(name)}`}>
            {getInitials(name)}
          </div>
        </div>

        <div className="network-card-body">
          <h3>{name}</h3>
          <p className="network-member-role">
            {person.headline || role}
          </p>

          {person.college && (
            <p className="network-member-meta">
              <span aria-hidden="true">⌂</span> {person.college}
            </p>
          )}

          {person.email && (
            <p className="network-member-meta network-member-email">
              {person.email}
            </p>
          )}

          {person.bio && <p className="network-member-bio">{person.bio}</p>}

          <div className="network-skills">
            {skills.length > 0 ? (
              skills.slice(0, 4).map((skill) => (
                <span key={skill}>{skill}</span>
              ))
            ) : (
              <span className="network-no-skills">Skills not added yet</span>
            )}
          </div>

          <div className="network-card-divider" />

          {view === "incoming" ? (
            <div className="network-action-row">
              <button
                className="network-btn network-btn-primary"
                disabled={isBusy}
                onClick={() => respondToRequest(member.id, "accepted")}
              >
                {isBusy ? "Updating…" : "Accept"}
              </button>
              <button
                className="network-btn network-btn-secondary"
                disabled={isBusy}
                onClick={() => respondToRequest(member.id, "rejected")}
              >
                Decline
              </button>
            </div>
          ) : view === "sent" ? (
            <button className="network-btn network-btn-pending" disabled>
              <span aria-hidden="true">◷</span> Pending response
            </button>
          ) : view === "connected" ? (
            <button className="network-btn network-btn-connected" disabled>
              <span aria-hidden="true">✓</span> Connected
            </button>
          ) : state === "connected" ? (
            <button className="network-btn network-btn-connected" disabled>
              <span aria-hidden="true">✓</span> Connected
            </button>
          ) : state === "pending" ? (
            <button className="network-btn network-btn-pending" disabled>
              <span aria-hidden="true">◷</span> Pending
            </button>
          ) : (
            <button
              className="network-btn network-btn-primary"
              disabled={isBusy || !id}
              onClick={() => sendRequest(id)}
            >
              {isBusy ? "Sending…" : <><span aria-hidden="true">＋</span> Connect</>}
            </button>
          )}
        </div>
      </article>
    );
  }

  const currentList = {
    discover: filteredMembers,
    incoming,
    sent,
    connected,
  }[activeTab];

  const headings = {
    discover: {
      eyebrow: "MEET YOUR COMMUNITY",
      title: "Find your people.",
      description:
        "Discover students and professionals who share your interests, goals, and ambition.",
      empty: "No matching members found",
      emptyDescription: "Try another search term or check back as the community grows.",
    },
    incoming: {
      eyebrow: "YOUR INVITATIONS",
      title: "Connection requests.",
      description: "People want to connect with you. Accept requests to grow your network.",
      empty: "You're all caught up",
      emptyDescription: "New connection requests will appear here.",
    },
    sent: {
      eyebrow: "YOUR OUTGOING REQUESTS",
      title: "People you've reached out to.",
      description: "Your requests remain pending until the other person responds.",
      empty: "No pending requests",
      emptyDescription: "Discover people and send a connection request to get started.",
    },
    connected: {
      eyebrow: "YOUR PROFESSIONAL CIRCLE",
      title: "Your network.",
      description: "Your accepted connections, all in one place.",
      empty: "Your network starts with one connection",
      emptyDescription: "Discover people who inspire you and start building your circle.",
    },
  }[activeTab];

  const receivedCount = incoming.length;
  const connectedCount = connected.length;

  return (
    <main className="network-page">
      <section className="network-hero">
        <div className="network-hero-copy">
          <span className="network-eyebrow">{headings.eyebrow}</span>
          <h1>
            Better careers are built <span>together.</span>
          </h1>
          <p>
            Meet people who are learning, creating, and working toward
            something bigger. Your next collaboration could start here.
          </p>
          <div className="network-hero-pills">
            <span><i /> Real Pathora members</span>
            <span><i /> Meaningful connections</span>
          </div>
        </div>

        <div className="network-hero-art" aria-hidden="true">
          <div className="network-art-ring ring-one" />
          <div className="network-art-ring ring-two" />
          <div className="network-art-orb orb-main">P</div>
          <div className="network-art-orb orb-one">✦</div>
          <div className="network-art-orb orb-two">↗</div>
          <div className="network-art-orb orb-three">◎</div>
        </div>
      </section>

      <section className="network-summary" aria-label="Network summary">
        <div className="network-summary-card">
          <span className="network-summary-icon">⌕</span>
          <div>
            <strong>{members.length}</strong>
            <span>Members to discover</span>
          </div>
        </div>
        <div className="network-summary-card">
          <span className="network-summary-icon request-icon">◷</span>
          <div>
            <strong>{receivedCount}</strong>
            <span>Received requests</span>
          </div>
        </div>
        <div className="network-summary-card">
          <span className="network-summary-icon connected-icon">↗</span>
          <div>
            <strong>{connectedCount}</strong>
            <span>Accepted connections</span>
          </div>
        </div>
      </section>

      <section className="network-content">
        <div className="network-section-heading">
          <div>
            <span className="network-eyebrow">YOUR NETWORK</span>
            <h2>{headings.title}</h2>
            <p>{headings.description}</p>
          </div>
        </div>

        <div className="network-toolbar">
          <div className="network-tabs" role="tablist" aria-label="Network views">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`network-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.id === "incoming" && receivedCount > 0 && (
                  <span className="network-tab-count">{receivedCount}</span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "discover" && (
            <label className="network-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search people, roles, skills..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search members"
              />
              {search && (
                <button
                  type="button"
                  className="network-clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </label>
          )}
        </div>

        {notice && (
          <div className="network-notice" role="status">
            <span>✓</span> {notice}
            <button onClick={() => setNotice("")} aria-label="Dismiss message">×</button>
          </div>
        )}

        {error && (
          <div className="network-error" role="alert">
            <span>{error}</span>
            <button onClick={() => setRefreshKey((key) => key + 1)}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="network-loading-grid" aria-label="Loading network">
            {[1, 2, 3].map((item) => (
              <div className="network-skeleton" key={item}>
                <div className="skeleton-cover" />
                <div className="skeleton-line wide" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
                <div className="skeleton-button" />
              </div>
            ))}
          </div>
        ) : currentList.length > 0 ? (
          <div className="network-grid">
            {currentList.map((member) => renderMemberCard(member, activeTab))}
          </div>
        ) : (
          <div className="network-empty">
            <div className="network-empty-icon">
              {activeTab === "incoming" ? "✉" : activeTab === "connected" ? "♧" : "⌕"}
            </div>
            <h3>{headings.empty}</h3>
            <p>{headings.emptyDescription}</p>
            {activeTab !== "discover" && (
              <button
                className="network-btn network-btn-primary"
                onClick={() => setActiveTab("discover")}
              >
                Discover members <span aria-hidden="true">↗</span>
              </button>
            )}
          </div>
        )}

        {!loading && activeTab === "discover" && filteredMembers.length > 0 && (
          <p className="network-results-note">
            Showing {filteredMembers.length} of {members.length} members
          </p>
        )}
      </section>

      <footer className="network-footer">
        <span className="network-footer-brand">pathora<span>.</span></span>
        <p>Build your circle. Share what you know. Grow together.</p>
      </footer>
    </main>
  );
}

export default Network;
