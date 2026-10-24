
require("dotenv").config();

const sequelize = require("./config/database");
const Job = require("./models/Job");

const sampleJobs = [
  {
    title: "Frontend Developer Intern",
    company: "DemoTech Solutions",
    location: "Remote",
    jobType: "Internship",
    workMode: "Remote",
    category: "Web Development",
    description:
      "Learn to build responsive web interfaces using React and JavaScript. Work with a development team on sample product features.",
    requirements:
      "HTML, CSS, JavaScript, basic React, and Git fundamentals.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
    salaryMin: 10000,
    salaryMax: 15000,
    salaryPeriod: "Stipend",
    experienceLevel: "Fresher",
    openings: 3,
    status: "Open",
  },
  {
    title: "Data Analyst Intern",
    company: "SampleData Labs",
    location: "Hyderabad, India",
    jobType: "Internship",
    workMode: "Hybrid",
    category: "Data Analytics",
    description:
      "Practice data cleaning, exploratory analysis, and reporting with sample business datasets.",
    requirements:
      "Basic Python, SQL, spreadsheets, and an interest in data visualization.",
    skills: ["Python", "SQL", "Excel", "Power BI"],
    salaryMin: 12000,
    salaryMax: 12000,
    salaryPeriod: "Stipend",
    experienceLevel: "Fresher",
    openings: 2,
    status: "Open",
  },
  {
    title: "Backend Developer Intern",
    company: "CodeCraft Demo",
    location: "Bengaluru, India",
    jobType: "Internship",
    workMode: "On-site",
    category: "Software Development",
    description:
      "Build and test REST APIs and learn how backend services communicate with databases.",
    requirements:
      "JavaScript fundamentals, basic Node.js, Express, and SQL.",
    skills: ["Node.js", "Express", "REST API", "MySQL"],
    salaryMin: 15000,
    salaryMax: 20000,
    salaryPeriod: "Stipend",
    experienceLevel: "Fresher",
    openings: 2,
    status: "Open",
  },
  {
    title: "Junior Full Stack Developer",
    company: "PracticeWorks",
    location: "Remote",
    jobType: "Full-time",
    workMode: "Remote",
    category: "Web Development",
    description:
      "Practice developing full-stack web applications with a React frontend and Node.js backend.",
    requirements:
      "React, Node.js, REST APIs, databases, and Git.",
    skills: ["React", "Node.js", "Express", "MySQL"],
    salaryMin: 400000,
    salaryMax: 600000,
    salaryPeriod: "Year",
    experienceLevel: "Entry-level",
    openings: 1,
    status: "Open",
  },
  {
    title: "Python Developer Intern",
    company: "PyLearn Demo",
    location: "Remote",
    jobType: "Internship",
    workMode: "Remote",
    category: "Software Development",
    description:
      "Work through sample Python scripting, data processing, and API integration tasks.",
    requirements:
      "Python fundamentals, problem-solving skills, and willingness to learn.",
    skills: ["Python", "SQL", "Git"],
    salaryMin: 8000,
    salaryMax: 12000,
    salaryPeriod: "Stipend",
    experienceLevel: "Fresher",
    openings: 2,
    status: "Open",
  },
  {
    title: "Graduate Software Engineer",
    company: "LaunchPad Demo",
    location: "Pune, India",
    jobType: "Full-time",
    workMode: "On-site",
    category: "Software Development",
    description:
      "Practice working on software features, automated tests, and collaborative development tasks.",
    requirements:
      "Programming fundamentals, OOP, data structures, algorithms, and SQL.",
    skills: ["Java", "Python", "DSA", "SQL"],
    salaryMin: 500000,
    salaryMax: 800000,
    salaryPeriod: "Year",
    experienceLevel: "Entry-level",
    openings: 2,
    status: "Open",
  },
];

async function seedJobs() {
  try {
    await sequelize.authenticate();

    // Create missing tables. This does not erase existing records.
    await sequelize.sync();

    let created = 0;
    let skipped = 0;

    for (const jobData of sampleJobs) {
      const existing = await Job.findOne({
        where: {
          title: jobData.title,
          company: jobData.company,
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await Job.create(jobData);
      created++;
    }

    console.log(`Seed complete. Created: ${created}, skipped: ${skipped}`);
  } catch (error) {
    console.error("Job seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedJobs();
