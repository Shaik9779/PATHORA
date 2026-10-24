
import { useEffect, useMemo, useState } from "react";
import "../App.css";

/*
 * PATHORA PROFILE API INTEGRATION
 *
 * Configure VITE_PROFILE_API_URL with your ACTUAL profile resource URL.
 *
 * Expected contract when configured:
 * GET   <VITE_PROFILE_API_URL>   -> JSON profile object
 * PATCH <VITE_PROFILE_API_URL>   -> accepts updated profile JSON
 *
 * These methods are an integration contract, NOT verified existing routes.
 * Adjust them to match your Express controller and authentication setup.
 *
 * Expected profile fields:
 * name, headline, email, location, about, education, graduationYear,
 * skills (string[]), projects (array), targetRoles (string[]),
 * workPreference, github, linkedin, website, resumeUrl
 */

const PROFILE_API_URL = import.meta.env.VITE_PROFILE_API_URL || "";

const EMPTY_PROFILE = {
  name: "",
  headline: "",
  email: "",
  location: "",
  about: "",
  education: "",
  graduationYear: "",
  skills: [],
  projects: [],
  targetRoles: [],
  workPreference: "Not specified",
  github: "",
  linkedin: "",
  website: "",
  resumeUrl: "",
};

const INITIAL_SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "Express.js",
  "Python",
  "Java",
  "MySQL",
  "Git & GitHub",
];

function normalizeProfile(data) {
  const source = data?.profile ?? data?.user ?? data;

  return {
    ...EMPTY_PROFILE,
    ...source,
    skills: Array.isArray(source?.skills) ? source.skills : [],
    projects: Array.isArray(source?.projects) ? source.projects : [],
    targetRoles: Array.isArray(source?.targetRoles)
      ? source.targetRoles
      : [],
  };
}

function calculateCompletion(profile) {
  const fields = [
    profile.name,
    profile.headline,
    profile.email,
    profile.location,
    profile.about,
    profile.education,
    profile.graduationYear,
    profile.skills.length > 0,
    profile.projects.length > 0,
    profile.github || profile.linkedin || profile.website,
  ];

  const completed = fields.filter((value) =>
    typeof value === "boolean" ? value : String(value ?? "").trim()
  ).length;

  return Math.round((completed / fields.length) * 100);
}

function safeExternalUrl(value) {
  if (!value) return "";

  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`
    );

    return ["http:", "https:"].includes(url.protocol)
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function Profile() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(Boolean(PROFILE_API_URL));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    technologies: "",
    github: "",
    demo: "",
  });

  useEffect(() => {
    if (!PROFILE_API_URL) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(PROFILE_API_URL, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(
            `Could not load profile (HTTP ${response.status}).`
          );
        }

        const data = await response.json();
        setProfile(normalizeProfile(data));
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message ||
              "Could not load your profile. Check the API configuration."
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProfile();

    return () => controller.abort();
  }, []);

  const completion = useMemo(
    () => calculateCompletion(profile),
    [profile]
  );

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
    setNotice("");
  }

  function addSkill() {
    const value = newSkill.trim();

    if (
      !value ||
      profile.skills.some(
        (skill) => skill.toLowerCase() === value.toLowerCase()
      )
    ) {
      return;
    }

    updateField("skills", [...profile.skills, value]);
    setNewSkill("");
  }

  function removeSkill(skillToRemove) {
    updateField(
      "skills",
      profile.skills.filter((skill) => skill !== skillToRemove)
    );
  }

  function addRole() {
    const value = newRole.trim();

    if (
      !value ||
      profile.targetRoles.some(
        (role) => role.toLowerCase() === value.toLowerCase()
      )
    ) {
      return;
    }

    updateField("targetRoles", [...profile.targetRoles, value]);
    setNewRole("");
  }

  function removeRole(roleToRemove) {
    updateField(
      "targetRoles",
      profile.targetRoles.filter((role) => role !== roleToRemove)
    );
  }

  function addProject() {
    if (!newProject.name.trim()) return;

    updateField("projects", [
      ...profile.projects,
      {
        ...newProject,
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        technologies: newProject.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    ]);

    setNewProject({
      name: "",
      description: "",
      technologies: "",
      github: "",
      demo: "",
    });
  }

  function removeProject(index) {
    updateField(
      "projects",
      profile.projects.filter((_, i) => i !== index)
    );
  }

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!PROFILE_API_URL) {
      setError(
        "Profile API is not configured. Your changes have not been saved to the server. Configure VITE_PROFILE_API_URL first."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(PROFILE_API_URL, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(
          `Could not save profile (HTTP ${response.status}).`
        );
      }

      const responseData = await response.json().catch(() => null);

      if (responseData) {
        setProfile(normalizeProfile(responseData));
      }

      setEditing(false);
      setNotice("Your profile was saved successfully.");
    } catch (err) {
      setError(
        err.message ||
          "Could not save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function cancelEditing() {
    setEditing(false);
    setError("");
    setNotice("");

    if (PROFILE_API_URL) {
      // Reload the server version so canceled changes are discarded.
      window.location.reload();
    }
  }

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const isConfigured = Boolean(PROFILE_API_URL);

  return (
    <div className="pathora-profile">
      <style>{`
        .pathora-profile {
          --pf-ink: #19243b;
          --pf-muted: #778399;
          --pf-blue: #5568ee;
          --pf-border: #e8ecf5;
          --pf-bg: #f7f9fd;
          min-height: 100vh;
          background: var(--pf-bg);
          color: var(--pf-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .pathora-profile *,
        .pathora-profile *::before,
        .pathora-profile *::after {
          box-sizing: border-box;
        }

        .pathora-profile button,
        .pathora-profile input,
        .pathora-profile textarea,
        .pathora-profile select {
          font: inherit;
        }

        .pathora-profile a {
          color: inherit;
          text-decoration: none;
          overflow-wrap: anywhere;
        }

        .pf-container {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
        }

        .pf-topbar {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: #fff;
          border-bottom: 1px solid var(--pf-border);
        }

        .pf-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 850;
          letter-spacing: -1px;
        }

        .pf-brand-mark {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 11px;
          background: linear-gradient(135deg, #5269f1, #9470f5);
          color: white;
          font-size: 19px;
        }

        .pf-brand-dot {
          color: #7665ed;
        }

        .pf-back {
          color: #6d7890 !important;
          font-size: 12px;
          font-weight: 700;
        }

        .pf-back:hover { color: var(--pf-blue) !important; }

        .pf-page {
          padding-top: 35px;
          padding-bottom: 65px;
        }

        .pf-page-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .pf-eyebrow {
          color: #6870e7;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1.2px;
        }

        .pf-page-head h1 {
          margin: 9px 0 8px;
          font-size: clamp(28px, 4vw, 37px);
          line-height: 1.2;
          letter-spacing: -1.4px;
          font-weight: 850;
        }

        .pf-page-head p {
          margin: 0;
          color: var(--pf-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .pf-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 15px;
          border: 1px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
          transition: transform .2s, box-shadow .2s;
        }

        .pf-button:hover { transform: translateY(-1px); }

        .pf-button:disabled {
          cursor: not-allowed;
          opacity: .6;
          transform: none;
        }

        .pf-button-primary {
          background: linear-gradient(110deg, #5369ef, #775de9);
          color: white;
          box-shadow: 0 6px 16px #5668ed25;
        }

        .pf-button-secondary {
          border-color: #e1e6f0;
          background: white;
          color: #39445a;
        }

        .pf-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 280px;
          align-items: start;
          gap: 20px;
        }

        .pf-main, .pf-sidebar {
          display: grid;
          gap: 18px;
          min-width: 0;
        }

        .pf-card {
          min-width: 0;
          padding: 23px;
          border: 1px solid var(--pf-border);
          border-radius: 17px;
          background: white;
          box-shadow: 0 3px 12px #28365e04;
        }

        .pf-identity {
          position: relative;
          overflow: hidden;
          padding-top: 0;
        }

        .pf-cover {
          height: 105px;
          margin: 0 -23px;
          background:
            radial-gradient(ellipse at 88% 20%, #c9d0ff 0, transparent 37%),
            radial-gradient(ellipse at 15% 100%, #dce5ff 0, transparent 44%),
            linear-gradient(110deg, #eef1ff, #f6f3ff);
          border-bottom: 1px solid #e7eaff;
        }

        .pf-identity-body { padding-top: 0; }

        .pf-identity-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-top: -37px;
        }

        .pf-avatar {
          position: relative;
          display: grid;
          place-items: center;
          width: 78px;
          height: 78px;
          flex-shrink: 0;
          border: 4px solid white;
          border-radius: 23px;
          background: linear-gradient(135deg, #5b6ded, #a17af2);
          color: white;
          font-size: 25px;
          font-weight: 850;
          box-shadow: 0 5px 16px #5268ef24;
        }

        .pf-identity-copy {
          padding-top: 12px;
          min-width: 0;
        }

        .pf-identity-copy h2 {
          margin: 0 0 6px;
          font-size: 22px;
          letter-spacing: -.8px;
          font-weight: 850;
          overflow-wrap: anywhere;
        }

        .pf-headline {
          margin: 0;
          color: #68748b;
          font-size: 12px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .pf-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 16px;
          margin-top: 14px;
          color: #808ba0;
          font-size: 10px;
        }

        .pf-meta span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          overflow-wrap: anywhere;
        }

        .pf-divider {
          height: 1px;
          margin: 20px 0;
          background: #edf0f6;
        }

        .pf-card-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .pf-card-heading h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 850;
          letter-spacing: -.3px;
        }

        .pf-card-heading span {
          color: #919aab;
          font-size: 10px;
        }

        .pf-body-copy {
          margin: 0;
          color: #69758c;
          font-size: 12px;
          line-height: 1.95;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .pf-empty {
          padding: 19px;
          border: 1px dashed #dfe4f0;
          border-radius: 12px;
          color: #8590a5;
          background: #fbfcff;
          font-size: 11px;
          line-height: 1.8;
        }

        .pf-field-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .pf-field {
          display: grid;
          gap: 7px;
          min-width: 0;
        }

        .pf-field-full { grid-column: 1 / -1; }

        .pf-field label {
          color: #58647b;
          font-size: 10px;
          font-weight: 800;
        }

        .pf-field input,
        .pf-field textarea,
        .pf-field select {
          width: 100%;
          min-width: 0;
          border: 1px solid #e0e6f0;
          border-radius: 9px;
          background: white;
          color: #25314a;
          padding: 11px 12px;
          outline: none;
          font-size: 12px;
        }

        .pf-field textarea {
          min-height: 105px;
          resize: vertical;
          line-height: 1.8;
        }

        .pf-field input:focus,
        .pf-field textarea:focus,
        .pf-field select:focus {
          border-color: #8390f4;
          box-shadow: 0 0 0 3px #6575f119;
        }

        .pf-field input:disabled,
        .pf-field textarea:disabled,
        .pf-field select:disabled {
          background: #fafbfe;
          color: #67738a;
          opacity: 1;
        }

        .pf-hint {
          color: #9099ab;
          font-size: 10px;
          line-height: 1.6;
        }

        .pf-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .pf-skill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 11px;
          border: 1px solid #e2e7ff;
          border-radius: 9px;
          background: #f4f5ff;
          color: #5262cc;
          font-size: 10px;
          font-weight: 750;
          overflow-wrap: anywhere;
        }

        .pf-remove {
          display: inline-grid;
          place-items: center;
          width: 20px;
          height: 20px;
          border: 0;
          border-radius: 6px;
          background: #e7eaff;
          color: #5863cf;
          cursor: pointer;
          font-size: 13px;
        }

        .pf-add-row {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .pf-add-row input { flex: 1; min-width: 0; }

        .pf-project {
          padding: 17px 0;
          border-top: 1px solid #edf0f6;
        }

        .pf-project:first-of-type {
          border-top: 0;
          padding-top: 0;
        }

        .pf-project-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .pf-project h4 {
          margin: 0;
          font-size: 13px;
          font-weight: 850;
          overflow-wrap: anywhere;
        }

        .pf-project p {
          margin: 8px 0 11px;
          color: #758198;
          font-size: 11px;
          line-height: 1.8;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .pf-project-links {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 12px;
        }

        .pf-project-links a {
          color: #5c68dc;
          font-size: 10px;
          font-weight: 800;
        }

        .pf-project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .pf-project-tags span {
          padding: 6px 8px;
          border-radius: 7px;
          background: #f3f5fa;
          color: #707d94;
          font-size: 9px;
        }

        .pf-education-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 12px;
          background: #eff0ff;
          color: #5d67df;
          font-size: 19px;
        }

        .pf-education-row {
          display: flex;
          align-items: flex-start;
          gap: 13px;
        }

        .pf-education-row h4 {
          margin: 1px 0 6px;
          font-size: 13px;
          font-weight: 850;
        }

        .pf-education-row p {
          margin: 0;
          color: #7d879b;
          font-size: 11px;
          line-height: 1.8;
        }

        .pf-progress-number {
          margin: 10px 0 5px;
          font-size: 34px;
          line-height: 1.2;
          letter-spacing: -1.6px;
          font-weight: 850;
        }

        .pf-progress-number small {
          font-size: 15px;
          color: #7e89a0;
          letter-spacing: 0;
        }

        .pf-progress-track {
          height: 7px;
          overflow: hidden;
          border-radius: 30px;
          background: #edf0f8;
        }

        .pf-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #536aef, #a078f3);
          transition: width .25s;
        }

        .pf-progress-note {
          margin: 12px 0 0;
          color: #7c879c;
          font-size: 10px;
          line-height: 1.8;
        }

        .pf-checklist {
          display: grid;
          gap: 13px;
          margin-top: 19px;
        }

        .pf-check {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #67738a;
          font-size: 11px;
          line-height: 1.6;
        }

        .pf-check-mark {
          display: grid;
          place-items: center;
          width: 19px;
          height: 19px;
          flex-shrink: 0;
          border-radius: 7px;
          background: #e9f8f0;
          color: #19845a;
          font-size: 11px;
          font-weight: 850;
        }

        .pf-check-pending {
          background: #f1f3f8;
          color: #a1a9b8;
        }

        .pf-side-links {
          display: grid;
          gap: 3px;
        }

        .pf-side-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 0;
          border-bottom: 1px solid #eff1f7;
          color: #58657d !important;
          font-size: 11px;
          font-weight: 700;
        }

        .pf-side-link:last-child { border-bottom: 0; }
        .pf-side-link:hover { color: var(--pf-blue) !important; }

        .pf-resume-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #f0f1ff;
          color: #5f68e7;
          font-size: 20px;
        }

        .pf-resume-copy {
          margin: 12px 0 15px;
          color: #7c879b;
          font-size: 11px;
          line-height: 1.8;
        }

        .pf-resume-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pf-resume-actions .pf-button { flex: 1; }

        .pf-alert {
          margin-bottom: 16px;
          padding: 12px 14px;
          border: 1px solid #f3d6d6;
          border-radius: 10px;
          background: #fff6f6;
          color: #a43e43;
          font-size: 11px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .pf-notice {
          margin-bottom: 16px;
          padding: 12px 14px;
          border: 1px solid #d2eddf;
          border-radius: 10px;
          background: #f1fbf5;
          color: #22734f;
          font-size: 11px;
          line-height: 1.8;
        }

        .pf-config-note {
          margin-top: 13px;
          color: #8a94a7;
          font-size: 10px;
          line-height: 1.7;
        }

        .pf-form-actions {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid #edf0f6;
        }

        .pf-loading {
          padding: 70px 20px;
          text-align: center;
          color: #7d879b;
          font-size: 13px;
        }

        .pf-footer {
          padding: 23px 0;
          border-top: 1px solid var(--pf-border);
          background: white;
          color: #8a94a7;
          font-size: 10px;
        }

        .pf-footer-inner {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        @media (max-width: 900px) {
          .pf-layout { grid-template-columns: minmax(0, 1fr) 245px; gap: 14px; }
          .pf-card { padding: 19px; }
          .pf-cover { margin-inline: -19px; }
          .pf-resume-actions { flex-direction: column; }
        }

        @media (max-width: 700px) {
          .pf-container { width: calc(100% - 30px); }
          .pf-layout { grid-template-columns: 1fr; }
          .pf-sidebar { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .pf-page { padding-top: 26px; }
          .pf-page-head { align-items: flex-start; }
          .pf-page-head p { max-width: 420px; }
          .pf-resume-actions { flex-direction: row; }
        }

        @media (max-width: 480px) {
          .pf-topbar { min-height: 64px; }
          .pf-brand { font-size: 20px; }
          .pf-page-head { flex-direction: column; align-items: stretch; }
          .pf-page-head > .pf-button { align-self: flex-start; }
          .pf-card { padding: 16px; border-radius: 14px; }
          .pf-cover { margin-inline: -16px; height: 85px; }
          .pf-avatar { width: 68px; height: 68px; border-radius: 19px; }
          .pf-identity-copy h2 { font-size: 19px; }
          .pf-identity-row { align-items: flex-end; }
          .pf-identity-row > .pf-button { padding-inline: 10px; }
          .pf-field-grid { grid-template-columns: 1fr; }
          .pf-field-full { grid-column: auto; }
          .pf-sidebar { grid-template-columns: 1fr; }
          .pf-progress-number { font-size: 30px; }
          .pf-footer-inner { justify-content: center; text-align: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pathora-profile *,
          .pathora-profile *::before,
          .pathora-profile *::after {
            transition: none !important;
          }
        }
      `}</style>

      <header className="pf-topbar">
        <div className="pf-container" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <a className="pf-brand" href="/" aria-label="Pathora home">
            <span className="pf-brand-mark">↗</span>
            <span>pathora<span className="pf-brand-dot">.</span></span>
          </a>

          <a className="pf-back" href="/jobs">
            ← Back to opportunities
          </a>
        </div>
      </header>

      <main className="pf-container pf-page">
        <div className="pf-page-head">
          <div>
            <span className="pf-eyebrow">YOUR PROFESSIONAL IDENTITY</span>
            <h1>My profile</h1>
            <p>
              Showcase your skills, projects, and career ambitions.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              className="pf-button pf-button-primary"
              onClick={() => {
                setError("");
                setNotice("");
                setEditing(true);
              }}
            >
              ✎ Edit profile
            </button>
          )}
        </div>

        {error && <div className="pf-alert" role="alert">{error}</div>}
        {notice && <div className="pf-notice" role="status">{notice}</div>}

        {!isConfigured && (
          <div className="pf-alert">
            Profile API is not configured. You can preview and edit this
            form, but saving to a server is disabled. Set
            {" "}VITE_PROFILE_API_URL to your actual profile endpoint
            after verifying the backend contract.
          </div>
        )}

        {loading ? (
          <div className="pf-card pf-loading" role="status">
            Loading your profile…
          </div>
        ) : (
          <form onSubmit={saveProfile}>
            <div className="pf-layout">
              <div className="pf-main">
                {/* Identity */}
                <section className="pf-card pf-identity">
                  <div className="pf-cover" />

                  <div className="pf-identity-body">
                    <div className="pf-identity-row">
                      <div className="pf-avatar" aria-label="Profile initials">
                        {initials || "P"}
                      </div>

                      {editing && (
                        <span style={{
                          color: "#6870e7",
                          fontSize: 10,
                          fontWeight: 800,
                        }}>
                          EDITING MODE
                        </span>
                      )}
                    </div>

                    <div className="pf-identity-copy">
                      <h2>{profile.name || "Your name"}</h2>
                      <p className="pf-headline">
                        {profile.headline ||
                          "Add a headline that describes your career goals."}
                      </p>

                      <div className="pf-meta">
                        {profile.location && (
                          <span>⌖ {profile.location}</span>
                        )}
                        {profile.email && (
                          <span>✉ {profile.email}</span>
                        )}
                      </div>
                    </div>

                    {!editing && (
                      <div className="pf-divider" />
                    )}

                    {!editing && (
                      <div>
                        <div className="pf-card-heading">
                          <h3>About</h3>
                        </div>

                        {profile.about ? (
                          <p className="pf-body-copy">{profile.about}</p>
                        ) : (
                          <div className="pf-empty">
                            Your introduction will appear here. Add a few
                            sentences about your interests, strengths, and
                            the kind of opportunities you're looking for.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                {editing && (
                  <section className="pf-card">
                    <div className="pf-card-heading">
                      <h3>Personal information</h3>
                      <span>Make your profile yours</span>
                    </div>

                    <div className="pf-field-grid">
                      <div className="pf-field">
                        <label htmlFor="pf-name">Full name</label>
                        <input
                          id="pf-name"
                          value={profile.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Your full name"
                          autoComplete="name"
                        />
                      </div>

                      <div className="pf-field">
                        <label htmlFor="pf-email">Email</label>
                        <input
                          id="pf-email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                        />
                      </div>

                      <div className="pf-field pf-field-full">
                        <label htmlFor="pf-headline">Professional headline</label>
                        <input
                          id="pf-headline"
                          value={profile.headline}
                          onChange={(e) =>
                            updateField("headline", e.target.value)
                          }
                          placeholder="e.g. CSE student | Aspiring Software Developer"
                          maxLength={140}
                        />
                      </div>

                      <div className="pf-field pf-field-full">
                        <label htmlFor="pf-location">Location</label>
                        <input
                          id="pf-location"
                          value={profile.location}
                          onChange={(e) =>
                            updateField("location", e.target.value)
                          }
                          placeholder="City, country"
                          autoComplete="address-level2"
                        />
                      </div>

                      <div className="pf-field pf-field-full">
                        <label htmlFor="pf-about">About me</label>
                        <textarea
                          id="pf-about"
                          value={profile.about}
                          onChange={(e) =>
                            updateField("about", e.target.value)
                          }
                          placeholder="Introduce yourself, your interests, your strengths, and your career goals."
                          maxLength={1500}
                        />
                        <span className="pf-hint">
                          {profile.about.length}/1500 characters
                        </span>
                      </div>

                      <div className="pf-field">
                        <label htmlFor="pf-education">Education</label>
                        <input
                          id="pf-education"
                          value={profile.education}
                          onChange={(e) =>
                            updateField("education", e.target.value)
                          }
                          placeholder="Degree and specialization"
                        />
                      </div>

                      <div className="pf-field">
                        <label htmlFor="pf-year">Graduation year</label>
                        <input
                          id="pf-year"
                          inputMode="numeric"
                          value={profile.graduationYear}
                          onChange={(e) =>
                            updateField("graduationYear", e.target.value)
                          }
                          placeholder="e.g. 2028"
                          maxLength={4}
                        />
                      </div>

                      <div className="pf-field pf-field-full">
                        <label htmlFor="pf-work">Work preference</label>
                        <select
                          id="pf-work"
                          value={profile.workPreference}
                          onChange={(e) =>
                            updateField("workPreference", e.target.value)
                          }
                        >
                          <option>Not specified</option>
                          <option>On-site</option>
                          <option>Hybrid</option>
                          <option>Remote</option>
                          <option>Flexible</option>
                        </select>
                      </div>
                    </div>
                  </section>
                )}

                {/* Skills */}
                <section className="pf-card">
                  <div className="pf-card-heading">
                    <h3>Technical skills</h3>
                    <span>{profile.skills.length} skills</span>
                  </div>

                  {profile.skills.length ? (
                    <div className="pf-skills">
                      {profile.skills.map((skill, index) => (
                        <span className="pf-skill" key={`${skill}-${index}`}>
                          {skill}
                          {editing && (
                            <button
                              type="button"
                              className="pf-remove"
                              aria-label={`Remove ${skill}`}
                              onClick={() => removeSkill(skill)}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="pf-empty">
                      Add the technologies and tools you know.
                    </div>
                  )}

                  {editing && (
                    <div className="pf-add-row">
                      <input
                        aria-label="Add a skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="e.g. React, Python, SQL"
                      />
                      <button
                        type="button"
                        className="pf-button pf-button-secondary"
                        onClick={addSkill}
                      >
                        + Add
                      </button>
                    </div>
                  )}
                </section>

                {/* Projects */}
                <section className="pf-card">
                  <div className="pf-card-heading">
                    <h3>Projects</h3>
                    <span>{profile.projects.length} projects</span>
                  </div>

                  {profile.projects.length ? (
                    profile.projects.map((project, index) => (
                      <article className="pf-project" key={`${project.name}-${index}`}>
                        <div className="pf-project-top">
                          <h4>{project.name || "Untitled project"}</h4>

                          {editing && (
                            <button
                              type="button"
                              className="pf-remove"
                              aria-label={`Remove ${project.name || "project"}`}
                              onClick={() => removeProject(index)}
                            >
                              ×
                            </button>
                          )}
                        </div>

                        <p>
                          {project.description || "No description provided."}
                        </p>

                        {Array.isArray(project.technologies) &&
                          project.technologies.length > 0 && (
                            <div className="pf-project-tags">
                              {project.technologies.map((technology, i) => (
                                <span key={`${technology}-${i}`}>
                                  {technology}
                                </span>
                              ))}
                            </div>
                          )}

                        <div className="pf-project-links">
                          {safeExternalUrl(project.github) && (
                            <a
                              href={safeExternalUrl(project.github)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              GitHub ↗
                            </a>
                          )}

                          {safeExternalUrl(project.demo) && (
                            <a
                              href={safeExternalUrl(project.demo)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Live demo ↗
                            </a>
                          )}
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="pf-empty">
                      Showcase your best work here. Personal projects help
                      employers understand what you can build.
                    </div>
                  )}

                  {editing && (
                    <>
                      <div className="pf-divider" />

                      <div className="pf-field-grid">
                        <div className="pf-field pf-field-full">
                          <label htmlFor="pf-project-name">Project name</label>
                          <input
                            id="pf-project-name"
                            value={newProject.name}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g. Career platform"
                          />
                        </div>

                        <div className="pf-field pf-field-full">
                          <label htmlFor="pf-project-description">
                            Description
                          </label>
                          <textarea
                            id="pf-project-description"
                            value={newProject.description}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                description: e.target.value,
                              })
                            }
                            placeholder="What problem does it solve? What did you build?"
                          />
                        </div>

                        <div className="pf-field pf-field-full">
                          <label htmlFor="pf-project-tech">
                            Technologies (comma-separated)
                          </label>
                          <input
                            id="pf-project-tech"
                            value={newProject.technologies}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                technologies: e.target.value,
                              })
                            }
                            placeholder="React, Node.js, MySQL"
                          />
                        </div>

                        <div className="pf-field">
                          <label htmlFor="pf-project-github">GitHub URL</label>
                          <input
                            id="pf-project-github"
                            type="url"
                            value={newProject.github}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                github: e.target.value,
                              })
                            }
                            placeholder="https://github.com/..."
                          />
                        </div>

                        <div className="pf-field">
                          <label htmlFor="pf-project-demo">Demo URL</label>
                          <input
                            id="pf-project-demo"
                            type="url"
                            value={newProject.demo}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                demo: e.target.value,
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="pf-button pf-button-secondary"
                        style={{ marginTop: 14 }}
                        onClick={addProject}
                        disabled={!newProject.name.trim()}
                      >
                        + Add project
                      </button>
                    </>
                  )}
                </section>

                {/* Education */}
                <section className="pf-card">
                  <div className="pf-card-heading">
                    <h3>Education</h3>
                    <span>Academic background</span>
                  </div>

                  {profile.education || profile.graduationYear ? (
                    <div className="pf-education-row">
                      <div className="pf-education-icon">▤</div>
                      <div>
                        <h4>
                          {profile.education || "Education details"}
                        </h4>
                        <p>
                          {profile.graduationYear
                            ? `Expected graduation: ${profile.graduationYear}`
                            : "Graduation year not specified"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="pf-empty">
                      Add your degree, specialization, and expected
                      graduation year in edit mode.
                    </div>
                  )}
                </section>

                {/* Career preferences */}
                <section className="pf-card">
                  <div className="pf-card-heading">
                    <h3>Career interests</h3>
                    <span>Your next goals</span>
                  </div>

                  {profile.targetRoles.length ? (
                    <div className="pf-skills">
                      {profile.targetRoles.map((role, index) => (
                        <span className="pf-skill" key={`${role}-${index}`}>
                          {role}
                          {editing && (
                            <button
                              type="button"
                              className="pf-remove"
                              aria-label={`Remove ${role}`}
                              onClick={() => removeRole(role)}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="pf-empty">
                      Add target roles to make your career interests clear.
                    </div>
                  )}

                  {editing && (
                    <div className="pf-add-row">
                      <input
                        aria-label="Add a target role"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addRole();
                          }
                        }}
                        placeholder="e.g. Software Engineer"
                      />
                      <button
                        type="button"
                        className="pf-button pf-button-secondary"
                        onClick={addRole}
                      >
                        + Add
                      </button>
                    </div>
                  )}
                </section>

                {/* Social links */}
                <section className="pf-card">
                  <div className="pf-card-heading">
                    <h3>Professional links</h3>
                    <span>Showcase your presence</span>
                  </div>

                  {editing ? (
                    <div className="pf-field-grid">
                      <div className="pf-field pf-field-full">
                        <label htmlFor="pf-github">GitHub</label>
                        <input
                          id="pf-github"
                          value={profile.github}
                          onChange={(e) => updateField("github", e.target.value)}
                          placeholder="https://github.com/your-username"
                        />
                      </div>

                      <div className="pf-field pf-field-full">
                        <label htmlFor="pf-linkedin">LinkedIn</label>
                        <input
                          id="pf-linkedin"
                          value={profile.linkedin}
                          onChange={(e) =>
                            updateField("linkedin", e.target.value)
                          }
                          placeholder="https://linkedin.com/in/your-profile"
                        />
                      </div>

                      <div className="pf-field pf-field-full">
                        <label htmlFor="pf-website">Portfolio website</label>
                        <input
                          id="pf-website"
                          value={profile.website}
                          onChange={(e) =>
                            updateField("website", e.target.value)
                          }
                          placeholder="https://yourportfolio.com"
                        />
                      </div>

                      <div className="pf-field pf-field-full">
                        <label htmlFor="pf-resume">Resume URL</label>
                        <input
                          id="pf-resume"
                          value={profile.resumeUrl}
                          onChange={(e) =>
                            updateField("resumeUrl", e.target.value)
                          }
                          placeholder="URL to your hosted resume PDF"
                        />
                        <span className="pf-hint">
                          Enter a real, accessible URL. This field does not
                          upload files.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="pf-side-links">
                      {[
                        ["GitHub", profile.github],
                        ["LinkedIn", profile.linkedin],
                        ["Portfolio", profile.website],
                      ].map(([label, value]) => {
                        const url = safeExternalUrl(value);

                        return url ? (
                          <a
                            className="pf-side-link"
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            key={label}
                          >
                            {label} <span>↗</span>
                          </a>
                        ) : null;
                      })}

                      {!profile.github &&
                        !profile.linkedin &&
                        !profile.website && (
                          <div className="pf-empty">
                            Add links to your professional profiles and work.
                          </div>
                        )}
                    </div>
                  )}
                </section>

                {editing && (
                  <div className="pf-form-actions">
                    <button
                      type="button"
                      className="pf-button pf-button-secondary"
                      onClick={cancelEditing}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="pf-button pf-button-primary"
                      disabled={saving}
                    >
                      {saving ? "Saving…" : "Save profile changes"}
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="pf-sidebar">
                <section className="pf-card">
                  <div className="pf-card-heading">
                    <h3>Profile strength</h3>
                  </div>

                  <span className="pf-eyebrow">COMPLETION</span>

                  <div className="pf-progress-number">
                    {completion}<small>%</small>
                  </div>

                  <div
                    className="pf-progress-track"
                    role="progressbar"
                    aria-label="Profile completion"
                    aria-valuenow={completion}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="pf-progress-fill"
                      style={{ width: `${completion}%` }}
                    />
                  </div>

                  <p className="pf-progress-note">
                    Complete your profile to better showcase your
                    experience and career interests.
                  </p>

                  <div className="pf-checklist">
                    {[
                      ["Name", Boolean(profile.name.trim())],
                      ["Professional headline", Boolean(profile.headline.trim())],
                      ["About section", Boolean(profile.about.trim())],
                      ["Education", Boolean(profile.education.trim())],
                      ["Technical skills", profile.skills.length > 0],
                      ["Projects", profile.projects.length > 0],
                      [
                        "Professional link",
                        Boolean(profile.github || profile.linkedin || profile.website),
                      ],
                    ].map(([label, done]) => (
                      <div className="pf-check" key={label}>
                        <span
                          className={`pf-check-mark ${
                            done ? "" : "pf-check-pending"
                          }`}
                        >
                          {done ? "✓" : "·"}
                        </span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>

                  {!editing && (
                    <button
                      type="button"
                      className="pf-button pf-button-primary"
                      style={{ width: "100%", marginTop: 20 }}
                      onClick={() => {
                        setError("");
                        setNotice("");
                        setEditing(true);
                      }}
                    >
                      Improve your profile
                    </button>
                  )}
                </section>

                <section className="pf-card">
                  <div className="pf-card-heading">
                    <h3>Your career toolkit</h3>
                  </div>

                  <div className="pf-side-links">
                    <a className="pf-side-link" href="/jobs">
                      Explore jobs <span>↗</span>
                    </a>
                    <a className="pf-side-link" href="/practice">
                      Coding practice <span>↗</span>
                    </a>
                    <a className="pf-side-link" href="/pathfinder">
                      Career direction <span>↗</span>
                    </a>
                  </div>
                </section>

                <section className="pf-card">
                  <div className="pf-resume-icon">▤</div>

                  <div className="pf-card-heading" style={{ marginTop: 15, marginBottom: 8 }}>
                    <h3>Your resume</h3>
                  </div>

                  <p className="pf-resume-copy">
                    Keep your resume accessible alongside your professional
                    profile.
                  </p>

                  {safeExternalUrl(profile.resumeUrl) ? (
                    <div className="pf-resume-actions">
                      <a
                        className="pf-button pf-button-primary"
                        href={safeExternalUrl(profile.resumeUrl)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View resume ↗
                      </a>
                    </div>
                  ) : (
                    <p className="pf-config-note">
                      Add a hosted resume URL in edit mode to enable this link.
                    </p>
                  )}
                </section>
              </aside>
            </div>
          </form>
        )}
      </main>

      <footer className="pf-footer">
        <div className="pf-container pf-footer-inner">
          <span>Pathora · Your career, your direction.</span>
          <a href="/">Back to home ↑</a>
        </div>
      </footer>
    </div>
  );
}

export default Profile;
