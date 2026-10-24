
import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import "./ResumeBuilder.css";

const STORAGE_KEY = "pathora_resume_draft";

const initialResume = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
  skills: "",
  education: "",
  projects: "",
  experience: "",
  certifications: "",
  jobDescription: "",
};

const sections = [
  ["summary", "Professional Summary", "Write a concise 2–3 line introduction."],
  ["education", "Education", "Degree, institution, graduation year, CGPA."],
  ["skills", "Technical Skills", "Python, Java, React, SQL..."],
  ["projects", "Projects", "Project, technologies, your contribution, results."],
  ["experience", "Experience", "Role, organization, dates, achievements."],
  ["certifications", "Certifications", "Certification name and issuing organization."],
];

function improveText(value) {
  const text = value.trim().replace(/\s+/g, " ");
  if (!text) return "";

  const first = text.charAt(0).toUpperCase() + text.slice(1);
  return /[.!?]$/.test(first) ? first : `${first}.`;
}

export default function ResumeBuilder() {
  const [resume, setResume] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? { ...initialResume, ...JSON.parse(saved) }
        : initialResume;
    } catch {
      return initialResume;
    }
  });

  const [activeTab, setActiveTab] = useState("edit");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    } catch {
      // The builder remains usable if browser storage is unavailable.
    }
  }, [resume]);

  const update = (event) => {
    const { name, value } = event.target;
    setResume((previous) => ({ ...previous, [name]: value }));
  };

  const filledSections = useMemo(
    () =>
      ["name", "email", "phone", "summary", "education", "skills", "projects"]
        .filter((key) => resume[key].trim()).length,
    [resume]
  );

  const keywords = useMemo(() => {
    const description = resume.jobDescription.toLowerCase();
    const skills = resume.skills
      .split(/[,;\n]/)
      .map((skill) => skill.trim())
      .filter(Boolean);

    return skills.map((skill) => ({
      skill,
      found: description.includes(skill.toLowerCase()),
    }));
  }, [resume.jobDescription, resume.skills]);

  const improveField = (field) => {
    const improved = improveText(resume[field]);
    if (!improved) {
      setNotice("Add some content before improving it.");
      return;
    }

    setResume((previous) => ({ ...previous, [field]: improved }));
    setNotice("Basic writing cleanup applied. Review the result before using it.");
  };

  const downloadPDF = () => {
    if (!resume.name.trim()) {
      setNotice("Enter your full name before downloading your resume.");
      return;
    }

    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 17;
    const usableWidth = pageWidth - margin * 2;
    let y = 18;

    const addPageIfNeeded = (height = 10) => {
      if (y + height > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
    };

    const writeWrapped = (text, options = {}) => {
      const { fontSize = 10, bold = false, gap = 2 } = options;
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(fontSize);

      const lines = pdf.splitTextToSize(String(text), usableWidth);
      const lineHeight = fontSize * 0.45 + 1.5;
      addPageIfNeeded(lines.length * lineHeight + gap);
      pdf.text(lines, margin, y);
      y += lines.length * lineHeight + gap;
    };

    pdf.setTextColor(25, 35, 55);
    writeWrapped(resume.name.trim(), { fontSize: 21, bold: true, gap: 2 });

    const contacts = [
      resume.email,
      resume.phone,
      resume.location,
      resume.linkedin,
      resume.github,
      resume.portfolio,
    ].filter(Boolean);

    if (contacts.length) {
      writeWrapped(contacts.join(" | "), { fontSize: 9, gap: 4 });
    }

    for (const [key, title] of sections) {
      const content = resume[key].trim();
      if (!content) continue;

      addPageIfNeeded(13);
      y += 2;
      pdf.setDrawColor(70, 70, 70);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 5;

      writeWrapped(title.toUpperCase(), { fontSize: 10, bold: true, gap: 3 });
      writeWrapped(content, { fontSize: 10, gap: 3 });
    }

    pdf.save(
      `${resume.name.trim().replace(/[^a-z0-9]+/gi, "_")}_Resume.pdf`
    );
    setNotice("PDF download requested. Review the exported file before sending it.");
  };

  return (
    <main className="resume-builder">
      <header className="resume-header">
        <div>
          <p className="resume-eyebrow">PATHORA CAREER STUDIO</p>
          <h1>Build a resume that opens doors.</h1>
          <p>Write clearly. Highlight real achievements. Download for free.</p>
        </div>
        <button className="resume-download" onClick={downloadPDF}>
          Download PDF
        </button>
      </header>

      <div className="resume-toolbar">
        <div>
          <strong>Resume workspace</strong>
          <span className="resume-muted"> · Saved in this browser</span>
        </div>
        <span className="resume-progress">
          {filledSections}/7 key fields completed
        </span>
      </div>

      {notice && (
        <div className="resume-notice" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}

      <div className="resume-workspace">
        <section className="resume-form-panel">
          <div className="resume-tabs">
            <button
              className={activeTab === "edit" ? "active" : ""}
              onClick={() => setActiveTab("edit")}
            >
              Edit resume
            </button>
            <button
              className={activeTab === "ats" ? "active" : ""}
              onClick={() => setActiveTab("ats")}
            >
              Job match
            </button>
          </div>

          {activeTab === "edit" ? (
            <>
              <h2>Your details</h2>
              <p className="resume-muted">
                Add only accurate information. Optional fields can be left blank.
              </p>

              {[
                ["name", "Full name", "Your full name"],
                ["email", "Email", "you@example.com"],
                ["phone", "Phone", "+91 9876543210"],
                ["location", "Location", "City, State"],
                ["linkedin", "LinkedIn URL", "linkedin.com/in/your-profile"],
                ["github", "GitHub URL", "github.com/your-profile"],
                ["portfolio", "Portfolio URL", "yourportfolio.com"],
              ].map(([name, label, placeholder]) => (
                <div className="resume-field" key={name}>
                  <label htmlFor={name}>{label}</label>
                  <input
                    id={name}
                    name={name}
                    value={resume[name]}
                    onChange={update}
                    placeholder={placeholder}
                  />
                </div>
              ))}

              {sections.map(([name, label, placeholder]) => (
                <div className="resume-field" key={name}>
                  <div className="resume-label-row">
                    <label htmlFor={name}>{label}</label>
                    {["summary", "projects", "experience"].includes(name) && (
                      <button
                        className="resume-text-action"
                        onClick={() => improveField(name)}
                      >
                        Improve writing
                      </button>
                    )}
                  </div>
                  <textarea
                    id={name}
                    name={name}
                    value={resume[name]}
                    onChange={update}
                    placeholder={placeholder}
                    rows={name === "summary" ? 4 : 3}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              <h2>Match a job description</h2>
              <p className="resume-muted">
                Compare the skills you entered against a target role. This is
                a simple keyword check, not a real ATS score.
              </p>
              <div className="resume-field">
                <label htmlFor="jobDescription">Paste job description</label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={resume.jobDescription}
                  onChange={update}
                  placeholder="Paste the job responsibilities and requirements here..."
                  rows={10}
                />
              </div>

              {resume.jobDescription.trim() && keywords.length > 0 && (
                <div className="resume-keywords">
                  <h3>Your skills against this job</h3>
                  {keywords.map(({ skill, found }) => (
                    <div className="resume-keyword" key={skill}>
                      <span>{skill}</span>
                      <span className={found ? "found" : "missing"}>
                        {found ? "Mentioned" : "Not mentioned"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <p className="resume-muted">
                Only add missing skills if you genuinely have them.
              </p>
            </>
          )}
        </section>

        <section className="resume-preview-panel">
          <div className="resume-preview-heading">
            <div>
              <h2>Live preview</h2>
              <p className="resume-muted">Classic · Single column · ATS-friendly</p>
            </div>
            <span className="resume-template-label">FREE</span>
          </div>

          <article className="resume-paper">
            <h1>{resume.name || "Your Name"}</h1>
            <p className="resume-contact">
              {[
                resume.email,
                resume.phone,
                resume.location,
                resume.linkedin,
                resume.github,
                resume.portfolio,
              ].filter(Boolean).join(" | ") || "Email · Phone · Location"}
            </p>

            {sections.map(([key, title]) => (
              <section className="paper-section" key={key}>
                <h3>{title.toUpperCase()}</h3>
                <p className="paper-content">
                  {resume[key] || `Add your ${title.toLowerCase()} in the editor.`}
                </p>
              </section>
            ))}
          </article>

          <button className="resume-download resume-download-wide" onClick={downloadPDF}>
            Download my resume — Free
          </button>
          <p className="resume-preview-note">
            Proofread your resume before applying. A simple format helps parsing,
            but no layout guarantees passing every ATS.
          </p>
        </section>
      </div>
    </main>
  );
}
