
// import "../App.css";

// function Home() {
//   return (
//     <div className="app">
//       <main>
//         {/* Hero Section */}
//         <section className="hero">
//           <div className="hero-content">
//             <div className="announcement">
//               <span className="status-dot" />
//               YOUR FUTURE, WITH A CLEAR DIRECTION
//             </div>

//             <h1>
//               Stop guessing.
//               <br />
//               Start <span className="gradient-text">growing.</span>
//             </h1>

//             <p className="hero-description">
//               Your career journey deserves more than random advice.
//               Discover what to learn, what to build, and what to do next —
//               all in one place.
//             </p>

//             <div className="hero-actions">
//               <a href="/pathfinder" className="primary-btn">
//                 Find your path <span>↗</span>
//               </a>
//             </div>

//             <div className="hero-proof">
//               <div className="proof-avatars">
//                 <span>S</span>
//                 <span>A</span>
//                 <span>R</span>
//               </div>

//               <p>
//                 <strong>Built for ambitious students</strong>
//                 <br />
//                 From confusion to confident action.
//               </p>
//             </div>
//           </div>

//           {/* Career Roadmap Preview */}
//           <div className="hero-visual" id="roadmap">
//             <div className="glow-orb" />

//             <div className="roadmap-card">
//               <div className="card-top">
//                 <div>
//                   <span className="eyebrow">YOUR CAREER SNAPSHOT</span>
//                   <h2>Your path to Data Analyst</h2>
//                 </div>

//                 <span className="live-badge">● YOUR PLAN</span>
//               </div>

//               <div className="progress-section">
//                 <div className="progress-label">
//                   <span>Roadmap progress</span>
//                   <strong>35%</strong>
//                 </div>

//                 <div className="progress-track">
//                   <div className="progress-fill" />
//                 </div>
//               </div>

//               <div className="roadmap-timeline">
//                 <div className="timeline-item completed">
//                   <div className="timeline-marker">✓</div>

//                   <div className="timeline-content">
//                     <span className="step-label">
//                       PHASE 01 · FOUNDATION
//                     </span>
//                     <h3>Python fundamentals</h3>
//                     <p>
//                       Core syntax, data types and problem solving
//                     </p>
//                   </div>

//                   <span className="step-status">Done</span>
//                 </div>

//                 <div className="timeline-item active">
//                   <div className="timeline-marker">02</div>

//                   <div className="timeline-content">
//                     <span className="step-label">
//                       PHASE 02 · IN PROGRESS
//                     </span>
//                     <h3>Data analysis with Pandas</h3>
//                     <p>
//                       Work with real datasets and uncover insights
//                     </p>
//                   </div>

//                   <span className="step-status">Now</span>
//                 </div>

//                 <div className="timeline-item upcoming">
//                   <div className="timeline-marker">03</div>

//                   <div className="timeline-content">
//                     <span className="step-label">
//                       PHASE 03 · NEXT UP
//                     </span>
//                     <h3>SQL &amp; visualization</h3>
//                     <p>
//                       Query data and communicate your findings
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="next-action">
//                 <div className="next-icon">✦</div>

//                 <div>
//                   <span>NEXT BEST ACTION</span>
//                   <p>Complete your first Pandas mini-project</p>
//                 </div>

//                 <span className="next-arrow">↗</span>
//               </div>
//             </div>

//             <div className="floating-tag tag-top">
//               <span>✦</span> A plan built around you
//             </div>

//             <div className="floating-tag tag-bottom">
//               <span>↗</span> One step at a time
//             </div>
//           </div>
//         </section>

//         {/* Features Section */}
//         <section className="feature-strip" id="features">
//           <div>
//             <span className="strip-number">01</span>
//             <p>Know what to learn</p>
//           </div>

//           <div>
//             <span className="strip-number">02</span>
//             <p>Build real-world skills</p>
//           </div>

//           <div>
//             <span className="strip-number">03</span>
//             <p>Become career-ready</p>
//           </div>
//         </section>

//         {/* How It Works Section */}
//         <section className="bottom-section" id="how-it-works">
//           <span className="eyebrow">
//             YOUR NEXT CHAPTER STARTS HERE
//           </span>

//           <h2>
//             Less confusion.{" "}
//             <span className="gradient-text">More direction.</span>
//           </h2>

//           <p>
//             One platform to turn your career goals into practical next steps.
//           </p>
//         </section>
//       </main>
//     </div>
//   );
// }

// export default Home;

import "../App.css";

const opportunities = [
  {
    company: "Technology",
    role: "Frontend Developer",
    type: "Internship",
    mode: "Explore opportunities",
    icon: "⌘",
    tone: "blue",
  },
  {
    company: "Data & Analytics",
    role: "Data Analyst Intern",
    type: "Internship",
    mode: "Explore opportunities",
    icon: "◈",
    tone: "violet",
  },
  {
    company: "Software Engineering",
    role: "Software Developer",
    type: "Entry level",
    mode: "Explore opportunities",
    icon: "⌘",
    tone: "orange",
  },
];

const pathways = [
  {
    number: "01",
    icon: "⌕",
    title: "Find opportunities",
    description:
      "Explore roles, discover opportunities, and keep track of jobs that interest you.",
    link: "/jobs",
    action: "Explore jobs",
  },
  {
    number: "02",
    icon: "⌘",
    title: "Practice with purpose",
    description:
      "Strengthen your problem-solving skills and prepare for technical interviews.",
    link: "/practice",
    action: "Start practicing",
  },
  {
    number: "03",
    icon: "◎",
    title: "Understand your skills",
    description:
      "Identify skills to improve and work toward your target career.",
    link: "/pathfinder",
    action: "Explore your path",
  },
  {
    number: "04",
    icon: "▤",
    title: "Build your resume",
    description:
      "Present your projects, technical skills, and experience professionally.",
    link: "/profile",
    action: "Build your profile",
  },
];

function Home() {
  return (
    <div className="pathora">
      <style>{`
        .pathora {
          --p-ink: #18233b;
          --p-muted: #758198;
          --p-blue: #5268ef;
          --p-purple: #8564f5;
          --p-border: #e9edf5;
          --p-bg: #f8faff;
          background: var(--p-bg);
          color: var(--p-ink);
          min-height: 100vh;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow: hidden;
        }

        .pathora *,
        .pathora *::before,
        .pathora *::after {
          box-sizing: border-box;
        }

        .pathora a {
          color: inherit;
          text-decoration: none;
        }

        .pathora button,
        .pathora input {
          font: inherit;
        }

        .p-container {
          width: min(1160px, calc(100% - 48px));
          margin-inline: auto;
        }

        .p-navbar {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid var(--p-border);
          background: rgba(255,255,255,.82);
        }

        .p-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          font-size: 23px;
          font-weight: 850;
          letter-spacing: -1px;
        }

        .p-brand-mark {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: white;
          font-size: 20px;
          background: linear-gradient(135deg, #5268ef, #9770fa);
          box-shadow: 0 5px 15px #5268ef30;
        }

        .p-gradient {
          color: #665ff0;
          background: linear-gradient(100deg, #4f6bf4, #9865ec);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .p-nav-links {
          display: flex;
          align-items: center;
          gap: 27px;
          color: #66728a;
          font-size: 12px;
          font-weight: 650;
        }

        .p-nav-links a:hover,
        .p-text-link:hover {
          color: var(--p-blue);
        }

        .p-btn {
          min-height: 45px;
          padding: 0 18px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          border: 1px solid transparent;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }

        .p-btn:hover {
          transform: translateY(-2px);
        }

        .p-btn-primary {
          background: linear-gradient(110deg, #5268ef, #7859e9);
          color: #fff !important;
          box-shadow: 0 7px 18px #5268ef28;
        }

        .p-btn-primary:hover {
          box-shadow: 0 11px 24px #5268ef40;
        }

        .p-btn-secondary {
          border-color: #e2e7f1;
          background: white;
          color: #35415a !important;
        }

        .p-hero {
          padding-top: 66px;
          padding-bottom: 76px;
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
          align-items: center;
          gap: 54px;
        }

        .p-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #5c65df;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.05px;
        }

        .p-kicker-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #7168ef;
          box-shadow: 0 0 0 4px #7168ef18;
        }

        .p-hero h1 {
          margin: 23px 0 20px;
          max-width: 570px;
          font-size: clamp(43px, 5vw, 66px);
          line-height: 1.06;
          letter-spacing: -3.6px;
          font-weight: 850;
        }

        .p-hero-copy {
          max-width: 475px;
          color: var(--p-muted);
          font-size: 14px;
          line-height: 1.95;
          margin: 0 0 25px;
        }

        .p-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        .p-social-proof {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 28px;
          color: #818ba0;
          font-size: 11px;
          line-height: 1.7;
        }

        .p-proof-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid #e4e8ff;
          border-radius: 12px;
          color: #6266e9;
          background: #f0f1ff;
          font-size: 18px;
        }

        .p-social-proof strong {
          display: block;
          color: #37435a;
          font-size: 12px;
        }

        /* Dashboard preview */

        .p-dashboard-wrap {
          position: relative;
          min-width: 0;
        }

        .p-dashboard-glow {
          position: absolute;
          inset: 12% -8% 3% 9%;
          border-radius: 40px;
          background: #dce1ff;
          filter: blur(45px);
          opacity: .65;
          pointer-events: none;
        }

        .p-dashboard {
          position: relative;
          padding: 23px;
          border: 1px solid #e4e8f4;
          border-radius: 22px;
          background: white;
          box-shadow: 0 24px 65px #28365e12;
        }

        .p-dashboard-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          margin-bottom: 23px;
        }

        .p-dashboard-label {
          display: block;
          margin-bottom: 6px;
          color: #9099ac;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .p-dashboard-head h2 {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -.65px;
        }

        .p-preview-badge {
          flex-shrink: 0;
          padding: 7px 9px;
          border-radius: 8px;
          color: #5965d9;
          background: #f0f1ff;
          font-size: 9px;
          font-weight: 800;
        }

        .p-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .p-stat {
          min-width: 0;
          padding: 14px 12px;
          border: 1px solid #edf0f7;
          border-radius: 13px;
          background: #fcfcff;
        }

        .p-stat-icon {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 9px;
          color: #6069e9;
          background: #eff0ff;
          font-size: 15px;
        }

        .p-stat-number {
          display: block;
          font-size: 21px;
          line-height: 1.3;
          letter-spacing: -.8px;
          font-weight: 850;
        }

        .p-stat-label {
          display: block;
          margin-top: 4px;
          color: #8490a5;
          font-size: 9px;
          line-height: 1.5;
        }

        .p-dashboard-section {
          margin-top: 24px;
        }

        .p-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .p-section-heading h3 {
          margin: 0;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -.2px;
        }

        .p-text-link {
          color: #5b66df !important;
          font-size: 10px;
          font-weight: 750;
        }

        .p-roadmap {
          padding: 15px;
          border: 1px solid #e9ecf7;
          border-radius: 14px;
          background: linear-gradient(125deg, #fafaff, #fff);
        }

        .p-roadmap-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .p-roadmap-top strong {
          display: block;
          font-size: 12px;
        }

        .p-roadmap-top p {
          margin: 5px 0 0;
          color: #8993a7;
          font-size: 10px;
          line-height: 1.6;
        }

        .p-roadmap-percent {
          color: #6067e9;
          font-size: 13px;
          font-weight: 850;
        }

        .p-progress-track {
          height: 6px;
          margin-top: 14px;
          overflow: hidden;
          border-radius: 20px;
          background: #e9ecf7;
        }

        .p-progress-fill {
          height: 100%;
          width: 35%;
          border-radius: inherit;
          background: linear-gradient(90deg, #536af2, #a16cf3);
        }

        .p-roadmap-footer {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 11px;
          color: #7b869b;
          font-size: 9px;
        }

        .p-roadmap-footer span {
          color: #5e68e9;
          font-weight: 800;
        }

        .p-dashboard-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 12px;
        }

        .p-mini-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border: 1px solid #edf0f7;
          border-radius: 12px;
          background: #fff;
        }

        .p-mini-icon {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #eff0ff;
          color: #6068e8;
          font-size: 16px;
        }

        .p-mini-card strong {
          display: block;
          font-size: 10px;
        }

        .p-mini-card span {
          display: block;
          margin-top: 4px;
          color: #8a94a7;
          font-size: 9px;
        }

        .p-dashboard-note {
          margin-top: 14px;
          color: #929bae;
          font-size: 9px;
          line-height: 1.6;
        }

        /* Shared section styles */

        .p-section {
          padding: 68px 0;
        }

        .p-section-white {
          background: #fff;
          border-top: 1px solid var(--p-border);
          border-bottom: 1px solid var(--p-border);
        }

        .p-section-intro {
          max-width: 640px;
          margin-bottom: 30px;
        }

        .p-overline {
          color: #6970e9;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 1.3px;
        }

        .p-section-title {
          margin: 12px 0 12px;
          font-size: clamp(28px, 3.5vw, 39px);
          line-height: 1.2;
          letter-spacing: -1.65px;
          font-weight: 850;
        }

        .p-section-description {
          max-width: 540px;
          margin: 0;
          color: #7b869b;
          font-size: 13px;
          line-height: 1.9;
        }

        /* Featured opportunities */

        .p-jobs-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 27px;
        }

        .p-jobs-heading .p-section-intro {
          margin-bottom: 0;
        }

        .p-jobs-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .p-job-card {
          min-width: 0;
          padding: 21px;
          border: 1px solid #e9edf5;
          border-radius: 17px;
          background: #fff;
          transition: transform .2s, border-color .2s, box-shadow .2s;
        }

        .p-job-card:hover {
          transform: translateY(-4px);
          border-color: #dce1ff;
          box-shadow: 0 13px 32px #28365e0a;
        }

        .p-job-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 19px;
        }

        .p-job-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          font-size: 19px;
          font-weight: 800;
        }

        .p-tone-blue { color: #5066e7; background: #edf0ff; }
        .p-tone-violet { color: #875de4; background: #f2edff; }
        .p-tone-orange { color: #c47a38; background: #fff3e8; }

        .p-job-type {
          padding: 7px 9px;
          border-radius: 8px;
          background: #f4f6fb;
          color: #758198;
          font-size: 9px;
          font-weight: 750;
        }

        .p-job-company {
          margin-bottom: 7px;
          color: #8993a6;
          font-size: 10px;
          font-weight: 700;
        }

        .p-job-card h3 {
          margin: 0 0 19px;
          font-size: 16px;
          letter-spacing: -.4px;
          font-weight: 800;
        }

        .p-job-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px solid #eef0f6;
          color: #5c66de;
          font-size: 10px;
          font-weight: 750;
        }

        .p-job-footer span:last-child {
          font-size: 17px;
        }

        .p-jobs-disclaimer {
          margin: 18px 0 0;
          color: #9099ac;
          font-size: 10px;
          line-height: 1.7;
        }

        /* Feature ecosystem */

        .p-pathways-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .p-pathway {
          display: flex;
          align-items: flex-start;
          gap: 17px;
          padding: 23px;
          border: 1px solid #e8ecf5;
          border-radius: 17px;
          background: white;
          transition: transform .2s, box-shadow .2s;
        }

        .p-pathway:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px #28365e09;
        }

        .p-pathway-icon {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 14px;
          background: #eff0ff;
          color: #6269e9;
          font-size: 21px;
        }

        .p-pathway-body { flex: 1; min-width: 0; }

        .p-pathway-number {
          color: #9ba4b7;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .p-pathway h3 {
          margin: 7px 0 8px;
          font-size: 15px;
          font-weight: 800;
        }

        .p-pathway p {
          margin: 0 0 13px;
          color: #7c879b;
          font-size: 11px;
          line-height: 1.8;
        }

        .p-pathway-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #5b65df !important;
          font-size: 10px;
          font-weight: 800;
        }

        .p-pathway-link:hover { gap: 12px; }

        /* Closing call to action */

        .p-cta-section {
          padding: 72px 0;
          background:
            radial-gradient(ellipse at 50% 110%, #e7eaff 0, transparent 65%),
            #fafbff;
        }

        .p-cta-panel {
          position: relative;
          overflow: hidden;
          padding: 49px 28px;
          border: 1px solid #e2e6ff;
          border-radius: 23px;
          background:
            radial-gradient(ellipse at 100% 0%, #eeedff 0, transparent 50%),
            linear-gradient(120deg, #fff, #f9f9ff);
          text-align: center;
        }

        .p-cta-panel h2 {
          max-width: 600px;
          margin: 14px auto;
          font-size: clamp(30px, 4vw, 43px);
          line-height: 1.18;
          letter-spacing: -1.9px;
          font-weight: 850;
        }

        .p-cta-panel p {
          max-width: 480px;
          margin: 0 auto 24px;
          color: #7b869b;
          font-size: 12px;
          line-height: 1.9;
        }

        .p-footer {
          padding: 23px 0;
          border-top: 1px solid var(--p-border);
          background: #fff;
        }

        .p-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          color: #8993a6;
          font-size: 10px;
        }

        .p-footer .p-brand {
          font-size: 18px;
        }

        .p-footer .p-brand-mark {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          font-size: 16px;
        }

        @media (max-width: 950px) {
          .p-hero {
            grid-template-columns: 1fr;
            gap: 43px;
            padding-top: 52px;
          }

          .p-hero-content { max-width: 650px; }
          .p-dashboard-wrap { width: min(100%, 620px); margin-inline: auto; }
          .p-hero h1 { max-width: 650px; }
          .p-jobs-grid { gap: 11px; }
          .p-job-card { padding: 17px; }
        }

        @media (max-width: 650px) {
          .p-container { width: calc(100% - 32px); }
          .p-navbar { min-height: 68px; gap: 12px; }
          .p-brand { font-size: 21px; }
          .p-brand-mark { width: 35px; height: 35px; }
          .p-nav-links { display: none; }
          .p-navbar > .p-btn { min-height: 39px; padding: 0 12px; font-size: 11px; }

          .p-hero {
            padding-top: 42px;
            padding-bottom: 55px;
            gap: 36px;
          }

          .p-hero h1 {
            font-size: clamp(43px, 11.3vw, 57px);
            letter-spacing: -2.7px;
          }

          .p-hero-copy { font-size: 13px; }
          .p-btn { min-height: 44px; padding: 0 14px; }
          .p-dashboard { padding: 15px; border-radius: 17px; }
          .p-dashboard-head { gap: 8px; }
          .p-dashboard-head h2 { font-size: 16px; }
          .p-preview-badge { font-size: 8px; padding: 6px; }
          .p-stat-grid { gap: 7px; }
          .p-stat { padding: 11px 8px; }
          .p-stat-number { font-size: 18px; }
          .p-stat-label { font-size: 8px; }
          .p-dashboard-bottom { gap: 7px; }
          .p-mini-card { padding: 9px 7px; gap: 7px; }
          .p-mini-icon { width: 29px; height: 29px; font-size: 13px; }
          .p-mini-card strong { font-size: 9px; }
          .p-mini-card span { font-size: 8px; }

          .p-section { padding: 51px 0; }
          .p-section-title { letter-spacing: -1px; }
          .p-jobs-heading { align-items: flex-start; flex-direction: column; }
          .p-jobs-grid { grid-template-columns: 1fr; }
          .p-job-card { padding: 19px; }
          .p-job-card h3 { margin-bottom: 15px; }
          .p-pathways-grid { grid-template-columns: 1fr; }
          .p-pathway { padding: 19px; gap: 13px; }
          .p-pathway-icon { width: 42px; height: 42px; }
          .p-cta-section { padding: 48px 0; }
          .p-cta-panel { padding: 37px 18px; border-radius: 18px; }
          .p-cta-panel h2 { letter-spacing: -1.2px; }
          .p-footer-inner { justify-content: center; text-align: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pathora *,
          .pathora *::before,
          .pathora *::after {
            transition: none !important;
          }
        }
      `}</style>

      {/* Navigation */}
      <header>
        <nav className="p-container p-navbar">
          <a className="p-brand" href="/" aria-label="Pathora home">
            <span className="p-brand-mark">↗</span>
            <span>pathora<span className="p-gradient">.</span></span>
          </a>

          <div className="p-nav-links">
  <a href="/opportunities">Find jobs</a>
  <a href="/practice">Practice</a>
  <a href="/profile">My profile</a>
  <a href="#pathways">Explore features</a>
</div>

          <a className="p-btn p-btn-primary" href="/pathfinder">
            Explore your path <span>↗</span>
          </a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="p-container p-hero">
          <div className="p-hero-content">
            <div className="p-kicker">
              <span className="p-kicker-dot" />
              YOUR CAREER JOURNEY, ALL IN ONE PLACE
            </div>

            <h1>
              Your ambition.
              <br />
              Your <span className="p-gradient">next move.</span>
            </h1>

            <p className="p-hero-copy">
              Discover opportunities, strengthen your skills, connect
              with other students, and take meaningful steps toward
              your career — all through Pathora.
            </p>

            <div className="p-hero-actions">
              <a className="p-btn p-btn-primary" href="/jobs">
                Explore opportunities <span>↗</span>
              </a>
              <a className="p-btn p-btn-secondary" href="/practice">
                Start practicing
              </a>
            </div>

            <div className="p-social-proof">
              <div className="p-proof-icon">✦</div>
              <div>
                <strong>Built for students and aspiring professionals</strong>
                Learn, prepare, connect, and move forward with purpose.
              </div>
            </div>
          </div>

          {/* Illustrative dashboard preview */}
          <div className="p-dashboard-wrap">
            <div className="p-dashboard-glow" />

            <div className="p-dashboard">
              <div className="p-dashboard-head">
                <div>
                  <span className="p-dashboard-label">
                    YOUR CAREER WORKSPACE
                  </span>
                  <h2>A clearer path forward</h2>
                </div>
                <span className="p-preview-badge">PREVIEW</span>
              </div>

              <div className="p-stat-grid">
                <div className="p-stat">
                  <span className="p-stat-icon">⌕</span>
                  <span className="p-stat-number">Jobs</span>
                  <span className="p-stat-label">Discover opportunities</span>
                </div>

                <div className="p-stat">
                  <span className="p-stat-icon">⌘</span>
                  <span className="p-stat-number">Practice</span>
                  <span className="p-stat-label">Sharpen your skills</span>
                </div>

                <div className="p-stat">
                  <span className="p-stat-icon">◎</span>
                  <span className="p-stat-number">Connect</span>
                  <span className="p-stat-label">Meet other students</span>
                </div>
              </div>

              <div className="p-dashboard-section">
                <div className="p-section-heading">
                  <h3>Your career development</h3>
                  <a className="p-text-link" href="/pathfinder">
                    Explore path ↗
                  </a>
                </div>

                <div className="p-roadmap">
                  <div className="p-roadmap-top">
                    <div>
                      <strong>Turn your goals into action</strong>
                      <p>
                        Learn, practice, build projects, and prepare for roles.
                      </p>
                    </div>
                    <span className="p-roadmap-percent">→</span>
                  </div>

                  <div className="p-progress-track">
                    <div
                      className="p-progress-fill"
                      style={{ width: "35%" }}
                    />
                  </div>

                  <div className="p-roadmap-footer">
                    <span>YOUR NEXT STEP</span>
                    Choose a skill to develop and start practicing.
                  </div>
                </div>
              </div>

              <div className="p-dashboard-bottom">
                <a className="p-mini-card" href="/practice">
                  <span className="p-mini-icon">⌘</span>
                  <span>
                    <strong>Coding practice</strong>
                    <span>Prepare for interviews</span>
                  </span>
                </a>

                <a className="p-mini-card" href="/profile">
                  <span className="p-mini-icon">▤</span>
                  <span>
                    <strong>Career profile</strong>
                    <span>Showcase your skills</span>
                  </span>
                </a>
              </div>

              <p className="p-dashboard-note">
                Illustrative preview — progress and activity are not
                connected to live account data.
              </p>
            </div>
          </div>
        </section>

        {/* Opportunities */}
        <section className="p-section p-section-white" id="opportunities">
          <div className="p-container">
            <div className="p-jobs-heading">
              <div className="p-section-intro">
                <span className="p-overline">OPPORTUNITIES AWAIT</span>
                <h2 className="p-section-title">
                  Find your next <span className="p-gradient">opportunity.</span>
                </h2>
                <p className="p-section-description">
                  Explore career possibilities, discover roles that interest
                  you, and take the next step toward your professional goals.
                </p>
              </div>

              <a className="p-btn p-btn-secondary" href="/jobs">
                Browse jobs <span>↗</span>
              </a>
            </div>

            <div className="p-jobs-grid">
              {opportunities.map((job) => (
                <a
                  href="/jobs"
                  className="p-job-card"
                  key={job.role}
                >
                  <div className="p-job-top">
                    <span className={`p-job-icon p-tone-${job.tone}`}>
                      {job.icon}
                    </span>
                    <span className="p-job-type">{job.type}</span>
                  </div>

                  <div className="p-job-company">{job.company}</div>
                  <h3>{job.role}</h3>

                  <div className="p-job-footer">
                    <span>{job.mode}</span>
                    <span>↗</span>
                  </div>
                </a>
              ))}
            </div>

            <p className="p-jobs-disclaimer">
              These are illustrative role categories, not verified live
              vacancies. Visit the jobs section to explore available listings.
            </p>
          </div>
        </section>

        {/* Platform features */}
        <section className="p-section" id="pathways">
          <div className="p-container">
            <div className="p-section-intro">
              <span className="p-overline">YOUR CAREER TOOLKIT</span>
              <h2 className="p-section-title">
                Everything starts with <span className="p-gradient">one step.</span>
              </h2>
              <p className="p-section-description">
                From discovering jobs to preparing for interviews, Pathora
                brings your career preparation journey into one place.
              </p>
            </div>

            <div className="p-pathways-grid">
              {pathways.map((item) => (
                <article className="p-pathway" key={item.number}>
                  <div className="p-pathway-icon">{item.icon}</div>

                  <div className="p-pathway-body">
                    <span className="p-pathway-number">
                      STEP {item.number}
                    </span>

                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    <a className="p-pathway-link" href={item.link}>
                      {item.action} <span>↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Final call to action */}
        <section className="p-cta-section">
          <div className="p-container">
            <div className="p-cta-panel">
              <span className="p-overline">
                YOUR NEXT CHAPTER STARTS HERE
              </span>

              <h2>
                Stop waiting.
                <br />
                Start <span className="p-gradient">building your future.</span>
              </h2>

              <p>
                Explore opportunities, work on your skills, and take
                your next career step with Pathora.
              </p>

              <a className="p-btn p-btn-primary" href="/pathfinder">
                Get started with Pathora <span>↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-footer">
        <div className="p-container p-footer-inner">
          <a className="p-brand" href="/">
            <span className="p-brand-mark">↗</span>
            <span>pathora<span className="p-gradient">.</span></span>
          </a>

          <span>Find opportunities. Build skills. Move forward.</span>
          <span>© {new Date().getFullYear()} Pathora</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
