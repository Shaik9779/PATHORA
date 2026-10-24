
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const QUICK_LINKS = [
  {
    title: "Career Pathfinder",
    description: "Build your personalized learning roadmap.",
    icon: "⌁",
    path: "/pathfinder",
    label: "Explore roadmap",
    tone: "violet",
  },
  {
    title: "Practice Arena",
    description: "Sharpen your coding and problem-solving skills.",
    icon: "⌘",
    path: "/practice",
    label: "Start practicing",
    tone: "blue",
  },
  {
    title: "Professional Network",
    description: "Meet peers and expand your connections.",
    icon: "♧",
    path: "/network",
    label: "Explore network",
    tone: "green",
  },
  {
    title: "Resume Builder",
    description: "Turn your experience into a polished resume.",
    icon: "▤",
    path: "/resume-builder",
    label: "Build your resume",
    tone: "orange",
  },
];

const INITIAL_PROGRESS = {
  completedTasks: {},
  completedProjects: {},
};

function readJSON(storage, key, fallback) {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readProgress() {
  const progress = readJSON(
    localStorage,
    "pathora_pathfinder_progress",
    INITIAL_PROGRESS
  );

  return {
    completedTasks: progress?.completedTasks || {},
    completedProjects: progress?.completedProjects || {},
  };
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getDisplayDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Dashboard() {
  const [user, setUser] = useState({
    name: "there",
    role: "student",
  });

  const [progress, setProgress] = useState(readProgress);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const refreshDashboard = useCallback(() => {
    const savedUser = readJSON(
      sessionStorage,
      "pathora_user",
      { name: "there", role: "student" }
    );

    setUser({
      name: savedUser?.name || "there",
      role: savedUser?.role || "student",
    });

    setProgress(readProgress());

    setSavedJobs(
      readJSON(localStorage, "pathora_saved_jobs", [])
    );

    setApplications(
      readJSON(localStorage, "pathora_applications", [])
    );
  }, []);

  useEffect(() => {
    refreshDashboard();

    window.addEventListener("focus", refreshDashboard);
    window.addEventListener("storage", refreshDashboard);

    return () => {
      window.removeEventListener("focus", refreshDashboard);
      window.removeEventListener("storage", refreshDashboard);
    };
  }, [refreshDashboard]);

  const firstName = user.name.trim().split(/\s+/)[0] || "there";

  const completedSkills = useMemo(
    () =>
      Object.values(progress.completedTasks).filter(Boolean).length,
    [progress]
  );

  const completedProjects = useMemo(
    () =>
      Object.values(progress.completedProjects).filter(Boolean).length,
    [progress]
  );

  const totalCompleted = completedSkills + completedProjects;
  const hasProgress = totalCompleted > 0;

  const stats = [
    {
      label: "Skills completed",
      value: completedSkills,
      icon: "⌁",
      tone: "violet",
      caption: "From your Pathfinder checklist",
    },
    {
      label: "Projects completed",
      value: completedProjects,
      icon: "✓",
      tone: "green",
      caption: "Projects marked complete",
    },
    {
      label: "Saved opportunities",
      value: savedJobs.length,
      icon: "♡",
      tone: "blue",
      caption: "Jobs bookmarked in this browser",
    },
    {
      label: "Applications",
      value: applications.length,
      icon: "↗",
      tone: "orange",
      caption: "Applications recorded in this browser",
    },
  ];

  return (
    <main className="dashboard-page">
      {/* Welcome hero */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <div className="dashboard-date">
            <span className="dashboard-live-dot" />
            {getDisplayDate()}
          </div>

          <span className="dashboard-overline">
            YOUR PERSONAL CAREER SPACE
          </span>

          <h1>
            {getGreeting()}, {firstName}
            <span className="dashboard-wave"> ✦</span>
          </h1>

          <p>
            Every small step counts. Keep learning, building, and moving
            closer to the career you want.
          </p>

          <div className="dashboard-hero-actions">
            <Link to="/pathfinder" className="dashboard-main-cta">
              Continue your journey <span>↗</span>
            </Link>

            <Link to="/opportunities" className="dashboard-secondary-cta">
              Explore jobs
            </Link>
          </div>

          <div className="dashboard-hero-footnote">
            <span>✦</span>
            Progress over perfection. One step at a time.
          </div>
        </div>

        <div className="dashboard-hero-visual" aria-hidden="true">
          <div className="dashboard-visual-orbit dashboard-orbit-one" />
          <div className="dashboard-visual-orbit dashboard-orbit-two" />
          <div className="dashboard-visual-orbit dashboard-orbit-three" />

          <div className="dashboard-visual-core">
            <span>P</span>
          </div>

          <div className="dashboard-float-card dashboard-float-top">
            <span className="dashboard-float-icon">✧</span>
            <div>
              <strong>Keep growing</strong>
              <small>Your future is built daily</small>
            </div>
          </div>

          <div className="dashboard-float-card dashboard-float-bottom">
            <span className="dashboard-float-check">✓</span>
            <div>
              <strong>{totalCompleted} completed</strong>
              <small>Roadmap checklist items</small>
            </div>
          </div>

          <span className="dashboard-hero-spark dashboard-spark-one">✦</span>
          <span className="dashboard-hero-spark dashboard-spark-two">✧</span>
        </div>
      </section>

      {/* Overview */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-overline">THE BIG PICTURE</span>
            <h2>Your career at a glance</h2>
            <p>A snapshot of what you've been working on.</p>
          </div>

          <Link to="/pathfinder" className="dashboard-text-link">
            View roadmap <span>↗</span>
          </Link>
        </div>

        <div className="dashboard-stats-grid">
          {stats.map((stat) => (
            <article className="dashboard-stat-card" key={stat.label}>
              <div className="dashboard-stat-top">
                <span className={`dashboard-stat-icon ${stat.tone}`}>
                  {stat.icon}
                </span>
                <span className="dashboard-stat-indicator">●</span>
              </div>

              <span className="dashboard-stat-label">{stat.label}</span>
              <strong className="dashboard-stat-value">{stat.value}</strong>
              <span className="dashboard-stat-note">{stat.caption}</span>
            </article>
          ))}
        </div>
      </section>

      {/* Main focus and progress */}
      <section className="dashboard-feature-grid">
        <article className="dashboard-panel dashboard-focus-panel">
          <div className="dashboard-panel-heading">
            <div>
              <span className="dashboard-overline">YOUR NEXT MOVE</span>
              <h2>Make today count.</h2>
            </div>
            <span className="dashboard-panel-symbol">✦</span>
          </div>

          <div className="dashboard-focus-content">
            <div className="dashboard-focus-number">01</div>
            <div>
              <h3>
                {hasProgress
                  ? "Keep your momentum going"
                  : "Start with your career roadmap"}
              </h3>

              <p>
                {hasProgress
                  ? "Pick up where you left off. Review your completed work and tackle the next unfinished task."
                  : "Choose your career direction and create a structured learning plan that fits your goals."}
              </p>
            </div>
          </div>

          <div className="dashboard-focus-tags">
            <span>🎯 Clear goals</span>
            <span>📚 Consistent learning</span>
          </div>

          <Link to="/pathfinder" className="dashboard-panel-cta">
            {hasProgress ? "Continue learning" : "Build my roadmap"}
            <span>↗</span>
          </Link>
        </article>

        <article className="dashboard-panel dashboard-progress-panel">
          <div className="dashboard-panel-heading">
            <div>
              <span className="dashboard-overline">YOUR MOMENTUM</span>
              <h2>Progress tracker</h2>
            </div>
            <span className="dashboard-progress-symbol">◎</span>
          </div>

          <div className="dashboard-progress-total">
            <div>
              <strong>{totalCompleted}</strong>
              <span>items completed</span>
            </div>
            <span className="dashboard-progress-badge">
              {hasProgress ? "In progress" : "Ready to start"}
            </span>
          </div>

          <div className="dashboard-progress-breakdown">
            <div className="dashboard-breakdown-row">
              <div className="dashboard-breakdown-label">
                <span className="dashboard-breakdown-dot skills-dot" />
                <span>Skills</span>
              </div>
              <strong>{completedSkills}</strong>
            </div>

            <div className="dashboard-progress-track">
              <div
                className="dashboard-progress-fill skills-fill"
                style={{
                  width: completedSkills
                    ? `${Math.min(completedSkills * 10, 100)}%`
                    : "0%",
                }}
              />
            </div>

            <div className="dashboard-breakdown-row">
              <div className="dashboard-breakdown-label">
                <span className="dashboard-breakdown-dot projects-dot" />
                <span>Projects</span>
              </div>
              <strong>{completedProjects}</strong>
            </div>

            <div className="dashboard-progress-track">
              <div
                className="dashboard-progress-fill projects-fill"
                style={{
                  width: completedProjects
                    ? `${Math.min(completedProjects * 20, 100)}%`
                    : "0%",
                }}
              />
            </div>
          </div>

          <p className="dashboard-progress-caption">
            These bars are visual activity indicators, not percentages of
            your entire roadmap.
          </p>

          <Link to="/pathfinder" className="dashboard-text-link">
            View your progress <span>↗</span>
          </Link>
        </article>
      </section>

      {/* Quick access */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-overline">EXPLORE PATHORA</span>
            <h2>Your workspace, your way</h2>
            <p>Everything you need to move your career forward.</p>
          </div>
        </div>

        <div className="dashboard-shortcut-grid">
          {QUICK_LINKS.map((item, index) => (
            <article
              className="dashboard-shortcut-card"
              key={item.path}
            >
              <div className="dashboard-shortcut-top">
                <span className={`dashboard-shortcut-icon ${item.tone}`}>
                  {item.icon}
                </span>
                <span className="dashboard-shortcut-index">
                  0{index + 1}
                </span>
              </div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <Link to={item.path}>
                {item.label} <span>↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Opportunities banner */}
      <section className="dashboard-opportunities">
        <div className="dashboard-opportunity-decoration" aria-hidden="true">
          ✧
        </div>

        <div className="dashboard-opportunity-copy">
          <span className="dashboard-overline">THE NEXT CHAPTER</span>
          <h2>Your next opportunity could start here.</h2>
          <p>
            Explore internships and entry-level jobs, discover roles that
            match your skills, and prepare for your next step.
          </p>

          <div className="dashboard-opportunity-note">
            <span>↗</span>
            New skills. Better projects. Stronger applications.
          </div>
        </div>

        <Link to="/opportunities" className="dashboard-opportunity-cta">
          Explore opportunities <span>↗</span>
        </Link>
      </section>

      <footer className="dashboard-page-footer">
        <Link to="/dashboard" className="dashboard-footer-brand">
          pathora<span>.</span>
        </Link>
        <p>Build skills. Create proof. Move forward.</p>
      </footer>
    </main>
  );
}

export default Dashboard;
