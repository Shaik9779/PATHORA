
import { useEffect, useMemo, useState } from "react";
import "./Opportunities.css";

const API_URL = `${
  import.meta.env.VITE_API_URL || "https://pathora-1.onrender.com"
}/api/jobs`;

const FILTERS = [
  { label: "All opportunities", value: "All" },
  { label: "Internships", value: "Internship" },
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Contract", value: "Contract" },
];

const EMPTY_APPLICATION = {
  name: "",
  email: "",
  phone: "",
  resumeLink: "",
  coverLetter: "",
};

const LOGO_COLORS = [
  "#e9e8ff",
  "#e2f6ee",
  "#fff0dd",
  "#fde7ef",
  "#e4efff",
  "#e5f5f8",
];

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function readLoggedInUser() {
  try {
    return JSON.parse(sessionStorage.getItem("pathora_user") || "null") || {};
  } catch {
    return {};
  }
}

function normalizeSkills(skills) {
  if (Array.isArray(skills)) {
    return skills.filter((skill) => typeof skill === "string");
  }

  if (typeof skills === "string") {
    try {
      const parsed = JSON.parse(skills);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function getInitials(company = "") {
  return company
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("") || "CO";
}

function formatSalary(job) {
  const { salaryMin, salaryMax, salaryPeriod } = job;

  if (salaryMin == null && salaryMax == null) {
    return "Salary not disclosed";
  }

  const formatAmount = (amount) => {
    if (amount == null) return null;

    if (salaryPeriod === "Year" && amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, "")} LPA`;
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const minimum = formatAmount(salaryMin);
  const maximum = formatAmount(salaryMax);

  let amount;

  if (minimum && maximum) {
    amount = minimum === maximum ? minimum : `${minimum} – ${maximum}`;
  } else {
    amount = minimum || maximum;
  }

  const suffix = {
    Year: "",
    Month: "/month",
    Hour: "/hour",
    Stipend: "/month stipend",
  }[salaryPeriod] ?? "";

  return `${amount}${suffix}`;
}

function formatDeadline(deadline) {
  if (!deadline) return null;

  const date = new Date(`${deadline}T00:00:00`);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getRequirements(requirements) {
  if (Array.isArray(requirements)) return requirements;

  if (typeof requirements !== "string" || !requirements.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(requirements);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Plain text requirements are supported below.
  }

  return requirements
    .split(/\n|•/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function Opportunities() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [mode, setMode] = useState("All");
  const [location, setLocation] = useState("All");
  const [activeTab, setActiveTab] = useState("Discover");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStep, setApplicationStep] = useState("details");
  const [notice, setNotice] = useState("");

  const [application, setApplication] = useState(() => {
    const user = readLoggedInUser();

    return {
      ...EMPTY_APPLICATION,
      name: user.name || "",
      email: user.email || "",
    };
  });

  const [savedIds, setSavedIds] = useState(() =>
    readStorage("pathora_saved_jobs", [])
  );

  const [appliedApplications, setAppliedApplications] = useState(() =>
    readStorage("pathora_applications", [])
  );

  // Fetch jobs from the Express API.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchJobs() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load opportunities.");
        }

        if (!Array.isArray(data.jobs)) {
          throw new Error("Unexpected response from the jobs API.");
        }

        setJobs(data.jobs);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message ||
              "Could not connect to Pathora. Check whether the backend is running."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchJobs();

    return () => controller.abort();
  }, []);

  const toggleSaved = (id) => {
    const isSaved = savedIds.some(
      (savedId) => String(savedId) === String(id)
    );

    const next = isSaved
      ? savedIds.filter((savedId) => String(savedId) !== String(id))
      : [...savedIds, id];

    try {
      localStorage.setItem("pathora_saved_jobs", JSON.stringify(next));
      setSavedIds(next);
      setNotice("");
    } catch {
      setNotice("Unable to save this bookmark in your browser.");
    }
  };

  const hasSaved = (id) =>
    savedIds.some((savedId) => String(savedId) === String(id));

  const hasApplied = (jobId) =>
    appliedApplications.some(
      (item) => String(item.jobId) === String(jobId)
    );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const skills = normalizeSkills(job.skills);

      const searchableValues = [
        job.title,
        job.company,
        job.location,
        job.jobType,
        job.workMode,
        job.category,
        job.description,
        ...skills,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesType = type === "All" || job.jobType === type;
      const matchesMode = mode === "All" || job.workMode === mode;

      const matchesLocation =
        location === "All" ||
        (location === "Remote"
          ? job.workMode === "Remote"
          : String(job.location || "")
              .toLowerCase()
              .includes(location.toLowerCase()));

      const matchesTab =
        activeTab !== "Saved" || hasSaved(job.id);

      return (
        matchesSearch &&
        matchesType &&
        matchesMode &&
        matchesLocation &&
        matchesTab
      );
    });
  }, [jobs, search, type, mode, location, activeTab, savedIds]);

  const internshipCount = jobs.filter(
    (job) => job.jobType === "Internship"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setType("All");
    setMode("All");
    setLocation("All");
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setApplicationStep("details");
    setNotice("");
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
    setApplicationStep("details");
    setNotice("");
  };

  const updateApplication = (event) => {
    const { name, value } = event.target;

    setApplication((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Applications are browser-only until the applications API is built.
  const submitApplication = (event) => {
    event.preventDefault();
    setNotice("");

    if (!selectedJob) return;

    if (hasApplied(selectedJob.id)) {
      setApplicationStep("success");
      return;
    }

    const newApplication = {
      applicationId: `${selectedJob.id}-${Date.now()}`,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      applicant: application.name.trim(),
      email: application.email.trim(),
      phone: application.phone.trim(),
      resumeLink: application.resumeLink.trim(),
      coverLetter: application.coverLetter.trim(),
      appliedAt: new Date().toISOString(),
      status: "Applied",
      demo: true,
    };

    const updatedApplications = [
      ...appliedApplications,
      newApplication,
    ];

    try {
      localStorage.setItem(
        "pathora_applications",
        JSON.stringify(updatedApplications)
      );

      setAppliedApplications(updatedApplications);
      setApplicationStep("success");
    } catch {
      setNotice(
        "Your application could not be saved in this browser. Please try again."
      );
    }
  };

  const selectedSkills = selectedJob
    ? normalizeSkills(selectedJob.skills)
    : [];

  const selectedRequirements = selectedJob
    ? getRequirements(selectedJob.requirements)
    : [];

  return (
    <main className="opportunities-page">
      <header className="opp-hero">
        <div>
          <span className="opp-eyebrow">
            YOUR NEXT CHAPTER STARTS HERE
          </span>

          <h1>Find work that moves you forward.</h1>

          <p>
            Discover internships and entry-level jobs that help you turn
            your skills into real-world experience.
          </p>
        </div>

        <div className="opp-hero-icon" aria-hidden="true">
          ✦
        </div>
      </header>

      <div className="opp-demo-notice">
        <span>APPLICATION DEMO</span>
        Job listings are loaded from your backend. Applications are still
        saved in this browser and are not sent to employers yet.
      </div>

      {notice && (
        <div className="opp-notice" role="status">
          {notice}
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <section className="opp-search-bar">
        <span aria-hidden="true">⌕</span>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Job title, company, or skill"
          aria-label="Search jobs"
        />

        <button onClick={() => setSearch(search.trim())}>
          Search
        </button>
      </section>

      <section className="opp-stats">
        <div>
          <strong>{jobs.length}</strong>
          <span>Available opportunities</span>
        </div>

        <div>
          <strong>{internshipCount}</strong>
          <span>Internships</span>
        </div>

        <div>
          <strong>{savedIds.length}</strong>
          <span>Saved by you</span>
        </div>
      </section>

      <div className="opp-layout">
        <aside className="opp-filters">
          <div className="opp-filter-heading">
            <h2>Filters</h2>
            <button onClick={resetFilters}>Clear all</button>
          </div>

          <div className="opp-filter-group">
            <label htmlFor="opp-type">Opportunity type</label>

            <select
              id="opp-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              {FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          <div className="opp-filter-group">
            <label htmlFor="opp-mode">Work mode</label>

            <select
              id="opp-mode"
              value={mode}
              onChange={(event) => setMode(event.target.value)}
            >
              <option value="All">All work modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div className="opp-filter-group">
            <label htmlFor="opp-location">Location</label>

            <select
              id="opp-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            >
              <option value="All">All locations</option>
              <option value="Remote">Remote</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          <div className="opp-filter-tip">
            <span>✦</span>
            <strong>Career tip</strong>
            <p>
              Prioritize roles that match your current skills and offer
              room to learn.
            </p>
          </div>
        </aside>

        <section className="opp-results">
          <div className="opp-results-heading">
            <div>
              <h2>Explore opportunities</h2>
              <p>
                {loading
                  ? "Loading jobs..."
                  : `${filteredJobs.length} ${
                      activeTab === "Saved" ? "saved" : "available"
                    } results`}
              </p>
            </div>

            <div className="opp-tabs">
              {["Discover", "Saved"].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "Saved" && ` (${savedIds.length})`}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="opp-empty" role="status">
              <h3>Loading opportunities...</h3>
              <p>Fetching the latest jobs from Pathora.</p>
            </div>
          ) : error ? (
            <div className="opp-empty" role="alert">
              <h3>Unable to load opportunities</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="opp-empty">
              <span>⌕</span>
              <h3>
                {activeTab === "Saved"
                  ? "No saved opportunities yet"
                  : "No opportunities found"}
              </h3>
              <p>
                {activeTab === "Saved"
                  ? "Save a job to find it here later."
                  : "Try another search or clear some filters."}
              </p>
              <button
                onClick={() => {
                  resetFilters();
                  setActiveTab("Discover");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="opp-job-list">
              {filteredJobs.map((job, index) => {
                const skills = normalizeSkills(job.skills);
                const applied = hasApplied(job.id);

                return (
                  <article className="opp-job-card" key={job.id}>
                    <div className="opp-job-top">
                      <div
                        className="opp-company-logo"
                        style={{
                          background:
                            LOGO_COLORS[index % LOGO_COLORS.length],
                        }}
                      >
                        {getInitials(job.company)}
                      </div>

                      <button
                        className={`opp-save-button ${
                          hasSaved(job.id) ? "saved" : ""
                        }`}
                        onClick={() => toggleSaved(job.id)}
                        aria-label={
                          hasSaved(job.id)
                            ? `Unsave ${job.title}`
                            : `Save ${job.title}`
                        }
                        title={
                          hasSaved(job.id) ? "Unsave job" : "Save job"
                        }
                      >
                        {hasSaved(job.id) ? "♥" : "♡"}
                      </button>
                    </div>

                    <h3>{job.title}</h3>
                    <p className="opp-company-name">{job.company}</p>

                    <div className="opp-job-meta">
                      <span>⌖ {job.location || "Location not specified"}</span>
                      <span>◷ {job.jobType}</span>
                      <span>◉ {job.experienceLevel || "Not specified"}</span>
                    </div>

                    <div className="opp-job-pay">
                      <strong>{formatSalary(job)}</strong>
                      <span>{job.workMode || "Work mode not specified"}</span>
                    </div>

                    {skills.length > 0 && (
                      <div className="opp-skill-tags">
                        {skills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    )}

                    <div className="opp-job-footer">
                      <span className="opp-demo-label">
                        {applied ? "Application saved locally" : "From Pathora API"}
                      </span>

                      <button onClick={() => openJobDetails(job)}>
                        {applied ? "View application" : "View details"}
                        <span aria-hidden="true"> →</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {selectedJob && (
        <div
          className="opp-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeJobDetails();
            }
          }}
        >
          <section
            className="opp-job-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="opp-modal-title"
          >
            <button
              className="opp-modal-close"
              onClick={closeJobDetails}
              aria-label="Close job details"
            >
              ×
            </button>

            {applicationStep === "success" ? (
              <div className="opp-application-success">
                <div className="opp-success-icon">✓</div>

                <p className="opp-success-eyebrow">
                  APPLICATION RECORDED
                </p>

                <h2 id="opp-modal-title">Application saved!</h2>

                <p>
                  Your application for <strong>{selectedJob.title}</strong>{" "}
                  at <strong>{selectedJob.company}</strong> has been saved
                  in this browser.
                </p>

                <div className="opp-success-details">
                  <span>Applicant</span>
                  <strong>
                    {appliedApplications.find(
                      (item) =>
                        String(item.jobId) === String(selectedJob.id)
                    )?.applicant || application.name}
                  </strong>

                  <span>Application status</span>
                  <strong>Applied</strong>
                </div>

                <p className="opp-success-disclaimer">
                  Demo mode: this application has not been sent to the
                  employer or saved in MySQL.
                </p>

                <button
                  className="opp-apply-button"
                  onClick={closeJobDetails}
                >
                  Done
                </button>
              </div>
            ) : applicationStep === "apply" ? (
              <>
                <span className="opp-demo-label">APPLICATION FORM</span>

                <h2 id="opp-modal-title">
                  Apply for {selectedJob.title}
                </h2>

                <p className="opp-company-name">
                  {selectedJob.company} · {selectedJob.location}
                </p>

                <form
                  className="opp-application-form"
                  onSubmit={submitApplication}
                >
                  <div className="opp-application-field">
                    <label htmlFor="applicant-name">Full name *</label>
                    <input
                      id="applicant-name"
                      name="name"
                      value={application.name}
                      onChange={updateApplication}
                      autoComplete="name"
                      required
                      maxLength={100}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="opp-application-field">
                    <label htmlFor="applicant-email">
                      Email address *
                    </label>
                    <input
                      id="applicant-email"
                      name="email"
                      type="email"
                      value={application.email}
                      onChange={updateApplication}
                      autoComplete="email"
                      required
                      maxLength={254}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="opp-application-field">
                    <label htmlFor="applicant-phone">Phone number *</label>
                    <input
                      id="applicant-phone"
                      name="phone"
                      type="tel"
                      value={application.phone}
                      onChange={updateApplication}
                      autoComplete="tel"
                      required
                      maxLength={25}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="opp-application-field">
                    <label htmlFor="applicant-resume">
                      Resume link (optional)
                    </label>
                    <input
                      id="applicant-resume"
                      name="resumeLink"
                      type="url"
                      value={application.resumeLink}
                      onChange={updateApplication}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="opp-application-field">
                    <label htmlFor="applicant-cover-letter">
                      Cover note (optional)
                    </label>
                    <textarea
                      id="applicant-cover-letter"
                      name="coverLetter"
                      value={application.coverLetter}
                      onChange={updateApplication}
                      rows={4}
                      maxLength={1500}
                      placeholder="Why are you interested in this role?"
                    />
                  </div>

                  <p className="opp-application-disclaimer">
                    Demo mode: this application will be saved in your
                    browser only, not submitted to the employer.
                  </p>

                  <button className="opp-apply-button" type="submit">
                    Submit application
                  </button>

                  <button
                    className="opp-cancel-button"
                    type="button"
                    onClick={() => setApplicationStep("details")}
                  >
                    Back to job details
                  </button>
                </form>
              </>
            ) : (
              <>
                <div
                  className="opp-company-logo opp-modal-logo"
                  style={{
                    background:
                      LOGO_COLORS[
                        Math.abs(Number(selectedJob.id) || 0) %
                          LOGO_COLORS.length
                      ],
                  }}
                >
                  {getInitials(selectedJob.company)}
                </div>

                <span className="opp-demo-label">JOB DETAILS</span>

                <h2 id="opp-modal-title">{selectedJob.title}</h2>
                <p className="opp-company-name">{selectedJob.company}</p>

                <div className="opp-modal-facts">
                  <span>⌖ {selectedJob.location}</span>
                  <span>{selectedJob.workMode}</span>
                  <span>{selectedJob.jobType}</span>
                  <span>{formatSalary(selectedJob)}</span>
                </div>

                <h3>About the role</h3>
                <p>
                  {selectedJob.description || "No description provided yet."}
                </p>

                {selectedSkills.length > 0 && (
                  <>
                    <h3>Skills</h3>
                    <div className="opp-skill-tags">
                      {selectedSkills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </>
                )}

                <h3>What you'll need</h3>

                {selectedRequirements.length > 0 ? (
                  <ul>
                    {selectedRequirements.map((requirement, index) => (
                      <li key={`${index}-${requirement}`}>{requirement}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No specific requirements have been listed.</p>
                )}

                {selectedJob.applicationDeadline && (
                  <p>
                    <strong>Application deadline:</strong>{" "}
                    {formatDeadline(selectedJob.applicationDeadline)}
                  </p>
                )}

                {selectedJob.openings != null && (
                  <p>
                    <strong>Open positions:</strong> {selectedJob.openings}
                  </p>
                )}

                <div className="opp-modal-notice">
                  Review the listing details before applying. Applications
                  are currently stored locally in demo mode.
                </div>

                <button
                  className="opp-apply-button"
                  onClick={() => {
                    if (hasApplied(selectedJob.id)) {
                      setApplicationStep("success");
                    } else {
                      setApplicationStep("apply");
                    }
                  }}
                >
                  {hasApplied(selectedJob.id)
                    ? "View application confirmation"
                    : "Apply Now →"}
                </button>

                <button
                  className="opp-modal-save"
                  onClick={() => toggleSaved(selectedJob.id)}
                >
                  {hasSaved(selectedJob.id)
                    ? "♥ Saved"
                    : "♡ Save opportunity"}
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
