
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "./Pathfinder.css";

const CAREERS = [
  "Software Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "AI / ML Engineer",
  "Data Engineer",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "DevOps Engineer",
  "Mobile App Developer",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const LEVEL_INFO = {
  Beginner: {
    label: "Starting from the basics",
    description:
      "Build fundamentals before moving into advanced topics and projects.",
    multiplier: 1.35,
    startingPhase: 0,
  },
  Intermediate: {
    label: "Building on existing skills",
    description:
      "Strengthen core concepts, solve practical problems, and build projects.",
    multiplier: 1,
    startingPhase: 1,
  },
  Advanced: {
    label: "Preparing for professional work",
    description:
      "Focus on system design, production-quality work, specialization, and interviews.",
    multiplier: 0.8,
    startingPhase: 2,
  },
};

const ROADMAPS = {
  "Software Developer": [
    {
      title: "Programming foundations",
      category: "Foundations",
      hours: 35,
      skills: ["Variables and data types", "Conditions and loops", "Functions", "Collections and debugging"],
      project: "Build a command-line expense tracker.",
      outcome: "Write small programs independently and explain your logic.",
      resources: [
        { label: "Python tutorial", url: "https://docs.python.org/3/tutorial/" },
      ],
    },
    {
      title: "Data structures and algorithms",
      category: "Problem solving",
      hours: 70,
      skills: ["Arrays and strings", "Hash maps and sets", "Stacks and queues", "Searching and sorting", "Trees and complexity"],
      project: "Solve a curated set of coding problems and explain their time complexity.",
      outcome: "Choose appropriate data structures and solve common interview problems.",
      resources: [
        { label: "LeetCode", url: "https://leetcode.com/" },
        { label: "VisuAlgo", url: "https://visualgo.net/" },
      ],
    },
    {
      title: "Git, testing and clean code",
      category: "Engineering",
      hours: 30,
      skills: ["Git branches and commits", "GitHub workflows", "Unit testing", "Error handling", "Code organization"],
      project: "Publish a tested application with a clear README.",
      outcome: "Maintain code safely and collaborate using version control.",
      resources: [
        { label: "Git documentation", url: "https://git-scm.com/doc" },
      ],
    },
    {
      title: "Databases and APIs",
      category: "Backend fundamentals",
      hours: 45,
      skills: ["SQL queries", "Relational modeling", "HTTP and REST", "Authentication basics", "API validation"],
      project: "Build an API connected to a database.",
      outcome: "Design data models and build reliable application interfaces.",
      resources: [
        { label: "MDN Web Docs", url: "https://developer.mozilla.org/" },
      ],
    },
    {
      title: "Production-ready project",
      category: "Portfolio",
      hours: 55,
      skills: ["Architecture", "Security basics", "Automated tests", "Deployment", "Documentation"],
      project: "Deploy a complete application with error handling and tests.",
      outcome: "Demonstrate a working application and explain technical trade-offs.",
      resources: [
        { label: "GitHub Skills", url: "https://skills.github.com/" },
      ],
    },
    {
      title: "Interview and job preparation",
      category: "Career readiness",
      hours: 35,
      skills: ["DSA revision", "Project walkthroughs", "Technical communication", "Resume", "Mock interviews"],
      project: "Complete a mock interview and present your project.",
      outcome: "Explain solutions clearly and demonstrate practical engineering skills.",
      resources: [
        { label: "Pramp", url: "https://www.pramp.com/" },
      ],
    },
  ],

  "Frontend Developer": [
    {
      title: "HTML, CSS and web fundamentals",
      category: "Foundations",
      hours: 40,
      skills: ["Semantic HTML", "CSS layout", "Flexbox and Grid", "Responsive design", "Accessibility"],
      project: "Build a responsive personal portfolio.",
      outcome: "Create accessible layouts that work across screen sizes.",
      resources: [{ label: "MDN", url: "https://developer.mozilla.org/" }],
    },
    {
      title: "JavaScript and browser APIs",
      category: "Programming",
      hours: 55,
      skills: ["Functions and objects", "Arrays and methods", "DOM", "Promises and async/await", "Fetch and error handling"],
      project: "Build an interactive application using a public API.",
      outcome: "Write maintainable JavaScript and handle asynchronous data.",
      resources: [{ label: "JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }],
    },
    {
      title: "React application development",
      category: "Framework",
      hours: 55,
      skills: ["Components and props", "State and effects", "Forms", "Routing", "Reusable components"],
      project: "Build a multi-page application with working forms.",
      outcome: "Structure and maintain a React application.",
      resources: [{ label: "React Learn", url: "https://react.dev/learn" }],
    },
    {
      title: "Professional frontend engineering",
      category: "Engineering",
      hours: 40,
      skills: ["API integration", "Testing", "Performance", "Accessibility audits", "State management"],
      project: "Build a searchable dashboard with loading and error states.",
      outcome: "Build usable, reliable, and performant interfaces.",
      resources: [{ label: "Web.dev", url: "https://web.dev/learn/" }],
    },
    {
      title: "Portfolio and deployment",
      category: "Portfolio",
      hours: 50,
      skills: ["Production builds", "Deployment", "Git workflow", "Documentation", "Debugging"],
      project: "Deploy two polished projects with live demos.",
      outcome: "Present real, working applications to recruiters.",
      resources: [{ label: "Vite Guide", url: "https://vite.dev/guide/" }],
    },
    {
      title: "Frontend interviews",
      category: "Career readiness",
      hours: 30,
      skills: ["JavaScript questions", "React fundamentals", "UI problem solving", "Project explanations", "Mock interviews"],
      project: "Complete a timed UI challenge and technical mock interview.",
      outcome: "Explain implementation choices and solve practical frontend tasks.",
      resources: [{ label: "Frontend Mentor", url: "https://www.frontendmentor.io/" }],
    },
  ],

  "Backend Developer": [
    {
      title: "Programming and web foundations",
      category: "Foundations",
      hours: 40,
      skills: ["Programming fundamentals", "HTTP", "JSON", "Git", "Command-line basics"],
      project: "Build a small command-line utility and document it.",
      outcome: "Understand program flow and the client-server model.",
      resources: [{ label: "MDN HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP" }],
    },
    {
      title: "APIs and server development",
      category: "Backend",
      hours: 55,
      skills: ["Routing", "Controllers", "Middleware", "Validation", "Error handling"],
      project: "Create a REST API with consistent response formats.",
      outcome: "Build and debug server-side endpoints.",
      resources: [{ label: "Express documentation", url: "https://expressjs.com/" }],
    },
    {
      title: "Databases and authentication",
      category: "Data",
      hours: 45,
      skills: ["SQL and joins", "Database relationships", "Indexes", "Password hashing", "Authentication and authorization"],
      project: "Build an authenticated API with relational data.",
      outcome: "Protect user data and model application information.",
      resources: [{ label: "PostgreSQL tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }],
    },
    {
      title: "Testing and system design",
      category: "Engineering",
      hours: 45,
      skills: ["Unit and integration tests", "Caching concepts", "Pagination", "Rate limiting", "API design"],
      project: "Add tests, pagination, and validation to an existing API.",
      outcome: "Design services that behave predictably under realistic usage.",
      resources: [{ label: "OWASP", url: "https://owasp.org/" }],
    },
    {
      title: "Deployment and observability",
      category: "Production",
      hours: 45,
      skills: ["Environment variables", "Deployment", "Logging", "CI/CD basics", "Security configuration"],
      project: "Deploy a backend and document its API and operational setup.",
      outcome: "Run and troubleshoot a deployed service.",
      resources: [{ label: "Docker documentation", url: "https://docs.docker.com/" }],
    },
    {
      title: "Backend interview readiness",
      category: "Career readiness",
      hours: 35,
      skills: ["SQL practice", "API design", "Concurrency concepts", "System design basics", "Project walkthrough"],
      project: "Design and explain a backend service under interview conditions.",
      outcome: "Discuss architecture, trade-offs, and failure scenarios.",
      resources: [{ label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }],
    },
  ],

  "Full Stack Developer": [
    {
      title: "Web foundations",
      category: "Foundations",
      hours: 40,
      skills: ["HTML and CSS", "JavaScript", "Git", "HTTP", "Responsive design"],
      project: "Build and publish a responsive multi-section website.",
      outcome: "Understand how browsers, requests, and layouts work.",
      resources: [{ label: "MDN", url: "https://developer.mozilla.org/" }],
    },
    {
      title: "Frontend with React",
      category: "Frontend",
      hours: 55,
      skills: ["Components", "State and effects", "Forms", "Routing", "API consumption"],
      project: "Build a multi-page React interface with loading and error states.",
      outcome: "Create an interactive frontend that consumes APIs.",
      resources: [{ label: "React Learn", url: "https://react.dev/learn" }],
    },
    {
      title: "Backend and REST APIs",
      category: "Backend",
      hours: 55,
      skills: ["Node.js", "Express", "REST conventions", "Validation", "Authentication"],
      project: "Build API endpoints for a user-facing application.",
      outcome: "Implement application logic and secure user flows.",
      resources: [{ label: "Node.js Learn", url: "https://nodejs.org/en/learn" }],
    },
    {
      title: "Database and integration",
      category: "Data",
      hours: 40,
      skills: ["SQL", "Data modeling", "CRUD", "Frontend-backend integration", "Authorization"],
      project: "Build a full-stack application with persistent data.",
      outcome: "Connect UI, API, and database into one working product.",
      resources: [{ label: "Sequelize documentation", url: "https://sequelize.org/docs/v6/" }],
    },
    {
      title: "Testing and deployment",
      category: "Production",
      hours: 45,
      skills: ["Integration tests", "Environment configuration", "Deployment", "Logging", "Security basics"],
      project: "Deploy a full-stack app and document setup instructions.",
      outcome: "Deliver a usable application outside your local machine.",
      resources: [{ label: "Vite deployment guide", url: "https://vite.dev/guide/static-deploy.html" }],
    },
    {
      title: "Portfolio and interviews",
      category: "Career readiness",
      hours: 35,
      skills: ["Project explanations", "DSA", "Debugging", "Architecture basics", "Resume and mock interviews"],
      project: "Present a live project and complete a technical mock interview.",
      outcome: "Demonstrate end-to-end engineering capability.",
      resources: [{ label: "GitHub Skills", url: "https://skills.github.com/" }],
    },
  ],

  "Data Analyst": [
    {
      title: "Excel and spreadsheet analysis",
      category: "Foundations",
      hours: 35,
      skills: ["Formulas", "Sorting and filtering", "Lookup functions", "Pivot tables", "Data cleaning"],
      project: "Analyze a sales dataset and create a summary report.",
      outcome: "Clean data and summarize key business metrics.",
      resources: [{ label: "Microsoft Excel help", url: "https://support.microsoft.com/excel" }],
    },
    {
      title: "SQL for analytics",
      category: "Querying",
      hours: 45,
      skills: ["SELECT and WHERE", "Aggregations", "JOINs", "CTEs", "Window functions"],
      project: "Answer business questions using a relational database.",
      outcome: "Extract and combine data correctly.",
      resources: [{ label: "SQLBolt", url: "https://sqlbolt.com/" }],
    },
    {
      title: "Statistics and analytical thinking",
      category: "Statistics",
      hours: 35,
      skills: ["Descriptive statistics", "Distributions", "Sampling", "Correlation", "Interpreting uncertainty"],
      project: "Analyze a dataset and explain limitations in your conclusions.",
      outcome: "Interpret patterns without overstating what the data proves.",
      resources: [{ label: "OpenIntro Statistics", url: "https://www.openintro.org/book/os/" }],
    },
    {
      title: "Python and Pandas",
      category: "Programming",
      hours: 50,
      skills: ["Python fundamentals", "Pandas", "Missing values", "Exploratory analysis", "Data visualization"],
      project: "Clean and analyze a real dataset using a reproducible notebook.",
      outcome: "Automate analysis and explain your findings.",
      resources: [{ label: "Pandas getting started", url: "https://pandas.pydata.org/docs/getting_started/" }],
    },
    {
      title: "BI dashboards and storytelling",
      category: "Visualization",
      hours: 40,
      skills: ["Power BI or Tableau", "Data modeling", "Chart selection", "Dashboard design", "Business storytelling"],
      project: "Create an interactive dashboard answering stakeholder questions.",
      outcome: "Communicate actionable findings visually.",
      resources: [{ label: "Microsoft Power BI learning", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/" }],
    },
    {
      title: "Portfolio and job readiness",
      category: "Career readiness",
      hours: 40,
      skills: ["End-to-end analysis", "SQL interview practice", "Business case studies", "Portfolio", "Resume and interviews"],
      project: "Publish two analyses and one dashboard with clear conclusions.",
      outcome: "Show evidence of analytical reasoning and communication.",
      resources: [{ label: "Kaggle datasets", url: "https://www.kaggle.com/datasets" }],
    },
  ],

  "Data Scientist": [
    {
      title: "Python and data handling",
      category: "Foundations",
      hours: 50,
      skills: ["Python", "NumPy", "Pandas", "Data cleaning", "Jupyter notebooks"],
      project: "Create a reproducible exploratory analysis.",
      outcome: "Load, clean, inspect, and transform datasets.",
      resources: [{ label: "Pandas documentation", url: "https://pandas.pydata.org/docs/" }],
    },
    {
      title: "Mathematics and statistics",
      category: "Statistics",
      hours: 60,
      skills: ["Probability", "Distributions", "Hypothesis testing", "Linear algebra basics", "Regression intuition"],
      project: "Analyze uncertainty and test a clearly defined hypothesis.",
      outcome: "Understand assumptions behind statistical methods.",
      resources: [{ label: "OpenIntro Statistics", url: "https://www.openintro.org/book/os/" }],
    },
    {
      title: "SQL and exploratory analysis",
      category: "Data",
      hours: 35,
      skills: ["SQL joins", "Aggregations", "Feature exploration", "Data leakage awareness", "Visualization"],
      project: "Investigate a business problem and prepare a modeling dataset.",
      outcome: "Turn raw data into a defensible analytical dataset.",
      resources: [{ label: "SQLBolt", url: "https://sqlbolt.com/" }],
    },
    {
      title: "Machine learning",
      category: "Modeling",
      hours: 65,
      skills: ["Train-test splits", "Regression", "Classification", "Metrics", "Cross-validation and pipelines"],
      project: "Build and evaluate a baseline predictive model.",
      outcome: "Compare models and explain their limitations.",
      resources: [{ label: "Scikit-learn guide", url: "https://scikit-learn.org/stable/user_guide.html" }],
    },
    {
      title: "Advanced modeling and communication",
      category: "Applied ML",
      hours: 55,
      skills: ["Feature engineering", "Model interpretation", "Imbalanced data", "Experiment design", "Communicating uncertainty"],
      project: "Improve a baseline and document evaluation trade-offs.",
      outcome: "Select metrics and methods appropriate to the problem.",
      resources: [{ label: "Kaggle", url: "https://www.kaggle.com/" }],
    },
    {
      title: "Portfolio and job preparation",
      category: "Career readiness",
      hours: 45,
      skills: ["End-to-end project", "Model evaluation", "Technical communication", "SQL", "Interview practice"],
      project: "Publish a complete project with reproducible results.",
      outcome: "Explain the business problem, methodology, and limitations.",
      resources: [{ label: "GitHub Skills", url: "https://skills.github.com/" }],
    },
  ],

  "AI / ML Engineer": [
    {
      title: "Python and software foundations",
      category: "Foundations",
      hours: 50,
      skills: ["Python", "Data structures", "Git", "Testing", "Virtual environments"],
      project: "Build a tested Python application with clear documentation.",
      outcome: "Write maintainable code before adding ML complexity.",
      resources: [{ label: "Python tutorial", url: "https://docs.python.org/3/tutorial/" }],
    },
    {
      title: "Mathematics and data preparation",
      category: "Foundations",
      hours: 60,
      skills: ["Linear algebra", "Probability", "Statistics", "NumPy", "Data preprocessing"],
      project: "Explore and prepare a dataset for model training.",
      outcome: "Understand data representations and modeling assumptions.",
      resources: [{ label: "NumPy learning", url: "https://numpy.org/learn/" }],
    },
    {
      title: "Machine learning fundamentals",
      category: "Machine learning",
      hours: 65,
      skills: ["Supervised learning", "Unsupervised learning", "Evaluation metrics", "Cross-validation", "Feature engineering"],
      project: "Train and evaluate a model against a baseline.",
      outcome: "Choose suitable metrics and diagnose model weaknesses.",
      resources: [{ label: "Scikit-learn", url: "https://scikit-learn.org/stable/" }],
    },
    {
      title: "Deep learning",
      category: "Deep learning",
      hours: 65,
      skills: ["Neural networks", "Gradient descent", "Embeddings", "Training and validation", "PyTorch or TensorFlow"],
      project: "Train a small neural network and report its evaluation.",
      outcome: "Understand training loops and common model failure modes.",
      resources: [{ label: "PyTorch tutorials", url: "https://pytorch.org/tutorials/" }],
    },
    {
      title: "Model serving and evaluation",
      category: "ML engineering",
      hours: 55,
      skills: ["Inference APIs", "Model versioning", "Data validation", "Monitoring concepts", "Reproducibility"],
      project: "Serve a model through an API with tests and documented limitations.",
      outcome: "Make a model usable in a software application.",
      resources: [{ label: "FastAPI", url: "https://fastapi.tiangolo.com/" }],
    },
    {
      title: "Specialization and portfolio",
      category: "Career readiness",
      hours: 50,
      skills: ["Choose a specialization", "Experiment tracking", "Responsible AI", "Project documentation", "Technical interviews"],
      project: "Publish an end-to-end ML project with reproducible results.",
      outcome: "Demonstrate engineering decisions as well as model performance.",
      resources: [{ label: "Hugging Face course", url: "https://huggingface.co/learn" }],
    },
  ],

  "Data Engineer": [
    {
      title: "Python, SQL and data modeling",
      category: "Foundations",
      hours: 55,
      skills: ["Python", "SQL", "Relational modeling", "Git", "Linux basics"],
      project: "Design a database and load a small dataset.",
      outcome: "Write reliable data transformations and queries.",
      resources: [{ label: "PostgreSQL tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }],
    },
    {
      title: "ETL and data pipelines",
      category: "Data pipelines",
      hours: 55,
      skills: ["Extract and transform", "Data validation", "Incremental loads", "Idempotency", "Logging"],
      project: "Build a repeatable pipeline from source data to a database.",
      outcome: "Handle failures and avoid duplicate or invalid data.",
      resources: [{ label: "Airflow documentation", url: "https://airflow.apache.org/docs/" }],
    },
    {
      title: "Warehousing and analytics",
      category: "Data platforms",
      hours: 45,
      skills: ["Dimensional modeling", "Fact and dimension tables", "Partitioning", "Query optimization", "Data quality"],
      project: "Create an analytical warehouse model for a business dataset.",
      outcome: "Organize data for reliable reporting.",
      resources: [{ label: "dbt documentation", url: "https://docs.getdbt.com/" }],
    },
    {
      title: "Orchestration and distributed processing",
      category: "Scale",
      hours: 60,
      skills: ["Workflow orchestration", "Spark fundamentals", "Batch processing", "Retries", "Monitoring"],
      project: "Orchestrate a pipeline with retries and validation.",
      outcome: "Operate repeatable workflows and understand scaling trade-offs.",
      resources: [{ label: "Apache Spark", url: "https://spark.apache.org/docs/latest/" }],
    },
    {
      title: "Cloud and production operations",
      category: "Production",
      hours: 50,
      skills: ["Object storage", "Cloud data services", "Permissions", "CI/CD basics", "Observability"],
      project: "Deploy a small pipeline and document its operational design.",
      outcome: "Understand reliability, cost, and access controls.",
      resources: [{ label: "AWS training", url: "https://aws.amazon.com/training/" }],
    },
    {
      title: "Portfolio and interviews",
      category: "Career readiness",
      hours: 35,
      skills: ["SQL challenges", "Pipeline design", "Data modeling", "Project explanations", "Interview practice"],
      project: "Publish an end-to-end data pipeline with a diagram and tests.",
      outcome: "Explain the pipeline, failure handling, and design decisions.",
      resources: [{ label: "GitHub Skills", url: "https://skills.github.com/" }],
    },
  ],

  "Cybersecurity Analyst": [
    {
      title: "IT and networking foundations",
      category: "Foundations",
      hours: 50,
      skills: ["Operating systems", "TCP/IP", "DNS and HTTP", "Linux basics", "Security fundamentals"],
      project: "Document a small lab network and common attack surfaces.",
      outcome: "Understand how systems communicate and where risks arise.",
      resources: [{ label: "Cisco Skills for All", url: "https://skillsforall.com/" }],
    },
    {
      title: "Security tools and defensive basics",
      category: "Security",
      hours: 50,
      skills: ["Logs", "Access control", "Hashing and encryption concepts", "Vulnerability management", "Threat modeling"],
      project: "Analyze sample system logs in a controlled lab.",
      outcome: "Recognize suspicious patterns and explain findings.",
      resources: [{ label: "OWASP", url: "https://owasp.org/" }],
    },
    {
      title: "Monitoring and incident response",
      category: "Blue team",
      hours: 50,
      skills: ["Log correlation", "Alert triage", "Incident lifecycle", "Evidence handling", "Reporting"],
      project: "Write an incident report from a simulated scenario.",
      outcome: "Document evidence, impact, and recommended remediation.",
      resources: [{ label: "MITRE ATT&CK", url: "https://attack.mitre.org/" }],
    },
    {
      title: "Hands-on security labs",
      category: "Practice",
      hours: 55,
      skills: ["Packet analysis", "Web security basics", "System hardening", "Detection rules", "Lab documentation"],
      project: "Complete a legal training lab and document defensive lessons.",
      outcome: "Apply techniques in authorized environments only.",
      resources: [{ label: "TryHackMe", url: "https://tryhackme.com/" }],
    },
    {
      title: "Portfolio and certifications planning",
      category: "Professional development",
      hours: 35,
      skills: ["Lab reports", "Security write-ups", "Role requirements", "Certification research", "Communication"],
      project: "Publish sanitized lab reports without sensitive data.",
      outcome: "Demonstrate defensive reasoning and responsible practice.",
      resources: [{ label: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" }],
    },
    {
      title: "Job readiness",
      category: "Career readiness",
      hours: 30,
      skills: ["Incident scenarios", "Networking revision", "Security fundamentals", "Resume", "Mock interviews"],
      project: "Present an incident investigation and remediation plan.",
      outcome: "Explain findings clearly and responsibly.",
      resources: [{ label: "NICE Framework", url: "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center" }],
    },
  ],

  "Cloud Engineer": [
    {
      title: "Linux, networking and scripting",
      category: "Foundations",
      hours: 50,
      skills: ["Linux CLI", "TCP/IP and DNS", "Permissions", "Bash or Python", "Git"],
      project: "Automate a system administration task and document it.",
      outcome: "Operate basic systems and troubleshoot connectivity.",
      resources: [{ label: "Linux Journey", url: "https://linuxjourney.com/" }],
    },
    {
      title: "Cloud core services",
      category: "Cloud",
      hours: 55,
      skills: ["Compute", "Storage", "Networking", "Identity and access", "Billing and budgets"],
      project: "Deploy a small application using least-privilege access.",
      outcome: "Understand cloud building blocks and cost implications.",
      resources: [{ label: "AWS Skill Builder", url: "https://skillbuilder.aws/" }],
    },
    {
      title: "Containers and infrastructure",
      category: "Infrastructure",
      hours: 50,
      skills: ["Docker", "Virtual networks", "Infrastructure as code", "Secrets management", "Configuration"],
      project: "Containerize an application and document its deployment.",
      outcome: "Create repeatable infrastructure and deployments.",
      resources: [{ label: "Docker docs", url: "https://docs.docker.com/" }],
    },
    {
      title: "Reliability and monitoring",
      category: "Operations",
      hours: 45,
      skills: ["Logs and metrics", "Health checks", "Backups", "Scaling basics", "Incident troubleshooting"],
      project: "Add monitoring and a recovery plan to a deployed service.",
      outcome: "Identify failures and design recovery procedures.",
      resources: [{ label: "Google Cloud learning", url: "https://cloud.google.com/learn" }],
    },
    {
      title: "Automation and security",
      category: "Production",
      hours: 45,
      skills: ["CI/CD", "IAM policies", "Network security", "Automation scripts", "Cost controls"],
      project: "Automate a deployment with documented security controls.",
      outcome: "Deploy consistently while managing access and cost.",
      resources: [{ label: "Terraform docs", url: "https://developer.hashicorp.com/terraform/docs" }],
    },
    {
      title: "Portfolio and interviews",
      category: "Career readiness",
      hours: 35,
      skills: ["Architecture diagrams", "Troubleshooting", "Cloud fundamentals", "Project explanations", "Interview practice"],
      project: "Publish a cloud architecture project with a cost estimate.",
      outcome: "Explain infrastructure choices, trade-offs, and reliability.",
      resources: [{ label: "Microsoft Learn", url: "https://learn.microsoft.com/training/" }],
    },
  ],

  "DevOps Engineer": [
    {
      title: "Linux, networking and Git",
      category: "Foundations",
      hours: 50,
      skills: ["Linux shell", "Networking", "Git", "Scripting", "Process management"],
      project: "Write a script to automate a repeatable operational task.",
      outcome: "Understand and automate common system operations.",
      resources: [{ label: "Linux Journey", url: "https://linuxjourney.com/" }],
    },
    {
      title: "Containers and application delivery",
      category: "Containers",
      hours: 45,
      skills: ["Docker", "Images and volumes", "Networking", "Environment configuration", "Compose"],
      project: "Containerize an application with reproducible configuration.",
      outcome: "Package and run software consistently.",
      resources: [{ label: "Docker docs", url: "https://docs.docker.com/" }],
    },
    {
      title: "CI/CD pipelines",
      category: "Automation",
      hours: 50,
      skills: ["Build pipelines", "Automated tests", "Artifacts", "Deployment stages", "Secrets"],
      project: "Create a pipeline that tests and deploys a sample app.",
      outcome: "Automate repeatable software delivery.",
      resources: [{ label: "GitHub Actions", url: "https://docs.github.com/en/actions" }],
    },
    {
      title: "Cloud and infrastructure as code",
      category: "Infrastructure",
      hours: 55,
      skills: ["Cloud networking", "IAM", "Terraform", "Infrastructure state", "Cost awareness"],
      project: "Provision a small environment using infrastructure as code.",
      outcome: "Manage infrastructure with repeatable, reviewable changes.",
      resources: [{ label: "Terraform docs", url: "https://developer.hashicorp.com/terraform/docs" }],
    },
    {
      title: "Monitoring and reliability",
      category: "Operations",
      hours: 50,
      skills: ["Logs and metrics", "Alerting", "Health checks", "Incident response", "Rollback strategies"],
      project: "Add monitoring and a recovery procedure to a deployed service.",
      outcome: "Diagnose incidents and reduce deployment risk.",
      resources: [{ label: "Kubernetes docs", url: "https://kubernetes.io/docs/home/" }],
    },
    {
      title: "Production portfolio and interviews",
      category: "Career readiness",
      hours: 35,
      skills: ["System troubleshooting", "Pipeline design", "Security", "Documentation", "Mock interviews"],
      project: "Publish an end-to-end delivery pipeline and architecture diagram.",
      outcome: "Demonstrate automation and operational reasoning.",
      resources: [{ label: "Google SRE books", url: "https://sre.google/books/" }],
    },
  ],

  "Mobile App Developer": [
    {
      title: "Programming and UI foundations",
      category: "Foundations",
      hours: 45,
      skills: ["Programming fundamentals", "UI layout", "State", "Git", "Mobile UX"],
      project: "Build a small multi-screen mobile interface.",
      outcome: "Understand app structure and user interactions.",
      resources: [{ label: "Flutter docs", url: "https://docs.flutter.dev/" }],
    },
    {
      title: "Choose a mobile stack",
      category: "Framework",
      hours: 55,
      skills: ["Flutter and Dart or React Native", "Navigation", "Reusable UI", "Forms", "State management"],
      project: "Build a multi-screen app with navigation and form validation.",
      outcome: "Structure a maintainable mobile application.",
      resources: [{ label: "React Native docs", url: "https://reactnative.dev/docs/getting-started" }],
    },
    {
      title: "APIs and local persistence",
      category: "Data",
      hours: 45,
      skills: ["HTTP requests", "JSON", "Local storage", "Authentication flows", "Offline and error states"],
      project: "Create an app that loads and saves user data.",
      outcome: "Handle network failures and persistent data.",
      resources: [{ label: "Flutter networking", url: "https://docs.flutter.dev/cookbook/networking" }],
    },
    {
      title: "Testing and device quality",
      category: "Quality",
      hours: 40,
      skills: ["Widget tests", "UI testing", "Accessibility", "Performance", "Device compatibility"],
      project: "Test a complete user flow and fix identified issues.",
      outcome: "Improve reliability across devices and screen sizes.",
      resources: [{ label: "Android Developers", url: "https://developer.android.com/" }],
    },
    {
      title: "Release and portfolio",
      category: "Delivery",
      hours: 45,
      skills: ["Build configuration", "Signing concepts", "Release preparation", "Crash reporting", "Documentation"],
      project: "Prepare a release-ready app and demo video.",
      outcome: "Show a complete mobile product and explain its design.",
      resources: [{ label: "Apple Developer", url: "https://developer.apple.com/" }],
    },
    {
      title: "Mobile interviews",
      category: "Career readiness",
      hours: 30,
      skills: ["Architecture", "State management", "Debugging", "Project walkthroughs", "Mock interviews"],
      project: "Explain the architecture and key trade-offs of your app.",
      outcome: "Demonstrate mobile engineering fundamentals.",
      resources: [{ label: "Android Developers", url: "https://developer.android.com/" }],
    },
  ],
};

const GENERIC_ROADMAP = [
  {
    title: "Core foundations",
    category: "Foundations",
    hours: 40,
    skills: ["Learn the domain fundamentals", "Understand key terminology", "Set up essential tools"],
    project: "Create a small exercise demonstrating the core concepts.",
    outcome: "Explain and apply the fundamental ideas.",
    resources: [{ label: "GitHub Skills", url: "https://skills.github.com/" }],
  },
  {
    title: "Core tools and workflows",
    category: "Practical skills",
    hours: 45,
    skills: ["Learn the tools used in the role", "Practice common workflows", "Debug typical issues"],
    project: "Complete a guided practical exercise.",
    outcome: "Use the essential tools without following every step of a tutorial.",
    resources: [{ label: "MDN Web Docs", url: "https://developer.mozilla.org/" }],
  },
  {
    title: "Applied project",
    category: "Portfolio",
    hours: 50,
    skills: ["Problem definition", "Implementation", "Testing", "Documentation"],
    project: "Build a project based on a realistic problem in your chosen field.",
    outcome: "Demonstrate practical ability with a documented result.",
    resources: [{ label: "GitHub", url: "https://github.com/" }],
  },
  {
    title: "Professional workflows",
    category: "Advanced practice",
    hours: 45,
    skills: ["Quality standards", "Collaboration", "Troubleshooting", "Review and iteration"],
    project: "Improve the project using feedback and measurable criteria.",
    outcome: "Explain trade-offs and improve the quality of your work.",
    resources: [{ label: "GitHub Skills", url: "https://skills.github.com/" }],
  },
  {
    title: "Portfolio and career preparation",
    category: "Career readiness",
    hours: 35,
    skills: ["Portfolio", "Resume", "Interview practice", "Role-specific exercises"],
    project: "Present your work and complete a role-relevant mock interview.",
    outcome: "Show evidence of ability and explain your decisions.",
    resources: [{ label: "LinkedIn", url: "https://www.linkedin.com/" }],
  },
];

function getCareerPhases(goal) {
  return ROADMAPS[goal] || GENERIC_ROADMAP;
}

function formatHours(hours) {
  if (hours >= 40) {
    const weeks = Math.ceil(hours / 40);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  }

  return `${hours} hours`;
}

function Icon({ name }) {
  const icons = {
    search: "⌕",
    route: "⌁",
    clock: "◷",
    target: "◎",
    check: "✓",
    book: "▤",
    project: "▦",
    lock: "◇",
    arrow: "↗",
    reset: "↻",
  };

  return (
    <span className="pf-icon" aria-hidden="true">
      {icons[name] || "•"}
    </span>
  );
}

function Pathfinder() {
  const [goal, setGoal] = useState("Software Developer");
  const [careerSearch, setCareerSearch] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [deadline, setDeadline] = useState("Flexible");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [activePhase, setActivePhase] = useState(0);
  const [completedTasks, setCompletedTasks] = useState({});
  const [completedProjects, setCompletedProjects] = useState({});
  const [expandedPhase, setExpandedPhase] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pathora_pathfinder_progress");
      if (saved) {
        const data = JSON.parse(saved);
        setCompletedTasks(data.completedTasks || {});
        setCompletedProjects(data.completedProjects || {});
      }
    } catch {
      // Start with empty progress if stored data is invalid.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "pathora_pathfinder_progress",
        JSON.stringify({ completedTasks, completedProjects })
      );
    } catch {
      // Progress remains usable in the current session if storage is unavailable.
    }
  }, [completedTasks, completedProjects]);

  const phases = useMemo(() => getCareerPhases(goal), [goal]);

  const weeklyHours = hoursPerDay * daysPerWeek;

  const adjustedPhases = useMemo(() => {
    const multiplier = LEVEL_INFO[level].multiplier;

    return phases.map((phase, index) => {
      const adjustedHours = Math.max(5, Math.round(phase.hours * multiplier));

      return {
        ...phase,
        id: `${goal}-${index}`,
        index,
        estimatedHours: adjustedHours,
        estimatedWeeks: Math.max(1, Math.ceil(adjustedHours / weeklyHours)),
      };
    });
  }, [goal, level, weeklyHours, phases]);

  const totalEstimatedHours = adjustedPhases.reduce(
    (total, phase) => total + phase.estimatedHours,
    0
  );

  const totalWeeks = adjustedPhases.reduce(
    (total, phase) => total + phase.estimatedWeeks,
    0
  );

  const allTasks = adjustedPhases.flatMap((phase) =>
    phase.skills.map((skill, skillIndex) => ({
      id: `${phase.id}-skill-${skillIndex}`,
      phaseId: phase.id,
    }))
  );

  const completedTaskCount = allTasks.filter(
    (task) => completedTasks[task.id]
  ).length;

  const completedProjectCount = adjustedPhases.filter(
    (phase) => completedProjects[phase.id]
  ).length;

  const totalItems = allTasks.length + adjustedPhases.length;
  const completedItems = completedTaskCount + completedProjectCount;

  const progress = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : 0;

  const nextTask = adjustedPhases
    .flatMap((phase) =>
      phase.skills.map((skill, skillIndex) => ({
        phase,
        skill,
        id: `${phase.id}-skill-${skillIndex}`,
      }))
    )
    .find((task) => !completedTasks[task.id]);

  function handleGenerate(event) {
    event.preventDefault();

    const normalizedGoal = CAREERS.find(
      (career) => career.toLowerCase() === careerSearch.trim().toLowerCase()
    );

    const finalGoal = normalizedGoal || goal;

    setGoal(finalGoal);
    setShowRoadmap(true);
    setActivePhase(0);
    setExpandedPhase(0);
  }

  function toggleTask(taskId) {
    setCompletedTasks((current) => ({
      ...current,
      [taskId]: !current[taskId],
    }));
  }

  function toggleProject(phaseId) {
    setCompletedProjects((current) => ({
      ...current,
      [phaseId]: !current[phaseId],
    }));
  }

  function resetProgress() {
    const confirmed = window.confirm(
      "Reset all saved task and project progress for Pathfinder?"
    );

    if (confirmed) {
      setCompletedTasks({});
      setCompletedProjects({});
    }
  }

  const suggestedCareers = careerSearch.trim()
    ? CAREERS.filter((career) =>
        career.toLowerCase().includes(careerSearch.trim().toLowerCase())
      )
    : CAREERS;

  return (
    <div className="pathfinder-app">
      <section className="pf-hero">
        <div className="pf-hero-copy">
          <div className="pf-eyebrow">
            <Icon name="route" />
            PATHORA PATHFINDER
          </div>

          <h1>
            Turn your career goal
            <br />
            into a <span>clear roadmap.</span>
          </h1>

          <p>
            Discover the skills to learn, the projects to build, and the
            milestones that move you closer to your target role.
          </p>

          <div className="pf-trust-row">
            <span>
              <Icon name="check" /> Structured learning phases
            </span>
            <span>
              <Icon name="check" /> Hands-on projects
            </span>
            <span>
              <Icon name="check" /> Progress tracking
            </span>
          </div>
        </div>

        <div className="pf-hero-card">
          <div className="pf-mini-card-top">
            <div className="pf-mini-icon">
              <Icon name="target" />
            </div>
            <span className="pf-status-pill">YOUR NEXT CHAPTER</span>
          </div>

          <h2>Make progress visible.</h2>
          <p>Every skill learned and project completed becomes evidence of growth.</p>

          <div className="pf-mini-progress-label">
            <span>Roadmap completion</span>
            <strong>{showRoadmap ? `${progress}%` : "Ready to start"}</strong>
          </div>

          <div className="pf-progress-track">
            <div
              className="pf-progress-fill"
              style={{ width: `${showRoadmap ? progress : 0}%` }}
            />
          </div>
        </div>
      </section>

      <section className="pf-builder">
        <div className="pf-section-heading">
          <div>
            <span className="pf-eyebrow">01 / PERSONALIZE</span>
            <h2>Build your career roadmap</h2>
            <p>Tell us your target and how much time you can commit.</p>
          </div>
        </div>

        <form className="pf-form" onSubmit={handleGenerate}>
          <div className="pf-field pf-field-wide">
            <label htmlFor="pf-career-search">Target career</label>

            <div className="pf-input-wrap">
              <Icon name="search" />
              <input
                id="pf-career-search"
                list="pf-career-options"
                value={careerSearch}
                onChange={(event) => {
                  setCareerSearch(event.target.value);

                  const match = CAREERS.find(
                    (career) =>
                      career.toLowerCase() ===
                      event.target.value.trim().toLowerCase()
                  );

                  if (match) setGoal(match);
                }}
                placeholder="Search e.g. Backend Developer"
                autoComplete="off"
              />

              <datalist id="pf-career-options">
                {CAREERS.map((career) => (
                  <option value={career} key={career} />
                ))}
              </datalist>
            </div>

            <span className="pf-field-help">
              Choose a supported career template. Other searches use a general
              starter roadmap.
            </span>

            {careerSearch.trim() && suggestedCareers.length > 0 && (
              <div className="pf-career-suggestions">
                {suggestedCareers.slice(0, 4).map((career) => (
                  <button
                    type="button"
                    key={career}
                    onClick={() => {
                      setGoal(career);
                      setCareerSearch(career);
                    }}
                  >
                    {career}
                    <span>↗</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pf-field">
            <label htmlFor="pf-level">Current skill level</label>
            <select
              id="pf-level"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              {LEVELS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <span className="pf-field-help">
              {LEVEL_INFO[level].description}
            </span>
          </div>

          <div className="pf-field">
            <label htmlFor="pf-deadline">Target timeline</label>
            <select
              id="pf-deadline"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            >
              <option>Flexible</option>
              <option>1 month</option>
              <option>3 months</option>
              <option>6 months</option>
              <option>12 months</option>
            </select>
            <span className="pf-field-help">
              A target to plan toward, not a job guarantee.
            </span>
          </div>

          <div className="pf-field">
            <label htmlFor="pf-daily-hours">Study time per day</label>
            <select
              id="pf-daily-hours"
              value={hoursPerDay}
              onChange={(event) => setHoursPerDay(Number(event.target.value))}
            >
              <option value={0.5}>30 minutes</option>
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
              <option value={4}>4 hours</option>
            </select>
          </div>

          <div className="pf-field">
            <label htmlFor="pf-study-days">Study days per week</label>
            <select
              id="pf-study-days"
              value={daysPerWeek}
              onChange={(event) => setDaysPerWeek(Number(event.target.value))}
            >
              <option value={3}>3 days</option>
              <option value={4}>4 days</option>
              <option value={5}>5 days</option>
              <option value={6}>6 days</option>
              <option value={7}>7 days</option>
            </select>
          </div>

          <div className="pf-form-footer">
            <div className="pf-time-estimate">
              <Icon name="clock" />
              <span>
                <strong>{weeklyHours} hours/week</strong>
                <small>Your planned learning time</small>
              </span>
            </div>

            <button className="pf-primary-button" type="submit">
              Generate roadmap <Icon name="arrow" />
            </button>
          </div>
        </form>
      </section>

      {showRoadmap && (
        <section className="pf-roadmap-section">
          <div className="pf-roadmap-heading">
            <div>
              <span className="pf-eyebrow">02 / YOUR ROADMAP</span>
              <h2>{goal}</h2>
              <p>
                {levelInfoText(level)} · {weeklyHours} study hours per week
              </p>
            </div>

            <button
              type="button"
              className="pf-reset-button"
              onClick={resetProgress}
            >
              <Icon name="reset" /> Reset progress
            </button>
          </div>

          <div className="pf-stats-grid">
            <div className="pf-stat-card">
              <span className="pf-stat-icon">
                <Icon name="route" />
              </span>
              <span className="pf-stat-label">Learning phases</span>
              <strong>{adjustedPhases.length}</strong>
              <small>From foundations to job readiness</small>
            </div>

            <div className="pf-stat-card">
              <span className="pf-stat-icon">
                <Icon name="clock" />
              </span>
              <span className="pf-stat-label">Estimated learning</span>
              <strong>{totalEstimatedHours}h</strong>
              <small>Planning estimate, not a guarantee</small>
            </div>

            <div className="pf-stat-card">
              <span className="pf-stat-icon">
                <Icon name="target" />
              </span>
              <span className="pf-stat-label">Estimated duration</span>
              <strong>{totalWeeks} weeks</strong>
              <small>At your selected weekly hours</small>
            </div>

            <div className="pf-stat-card">
              <span className="pf-stat-icon">
                <Icon name="check" />
              </span>
              <span className="pf-stat-label">Your progress</span>
              <strong>{progress}%</strong>
              <small>
                {completedItems} of {totalItems} items completed
              </small>
            </div>
          </div>

          <div className="pf-roadmap-layout">
            <div className="pf-phase-list">
              <div className="pf-list-header">
                <div>
                  <h3>Learning journey</h3>
                  <p>Work through the phases and verify your skills.</p>
                </div>
              </div>

              {adjustedPhases.map((phase, index) => {
                const phaseTasks = phase.skills.map(
                  (_, skillIndex) => `${phase.id}-skill-${skillIndex}`
                );

                const doneTasks = phaseTasks.filter(
                  (taskId) => completedTasks[taskId]
                ).length;

                const phaseDone =
                  doneTasks === phase.skills.length &&
                  completedProjects[phase.id];

                return (
                  <button
                    type="button"
                    key={phase.id}
                    className={`pf-phase-row ${
                      activePhase === index ? "active" : ""
                    } ${phaseDone ? "complete" : ""}`}
                    onClick={() => {
                      setActivePhase(index);
                      setExpandedPhase(index);
                    }}
                  >
                    <span className="pf-phase-number">
                      {phaseDone ? "✓" : String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="pf-phase-info">
                      <small>{phase.category}</small>
                      <strong>{phase.title}</strong>
                      <span>
                        {doneTasks}/{phase.skills.length} skills ·{" "}
                        {phase.estimatedWeeks}{" "}
                        {phase.estimatedWeeks === 1 ? "week" : "weeks"}
                      </span>
                    </span>

                    <span className="pf-phase-arrow">›</span>
                  </button>
                );
              })}
            </div>

            <div className="pf-phase-detail">
              {(() => {
                const phase = adjustedPhases[activePhase];

                if (!phase) return null;

                return (
                  <>
                    <div className="pf-detail-top">
                      <div>
                        <span className="pf-phase-chip">
                          PHASE {String(activePhase + 1).padStart(2, "0")}
                        </span>
                        <h3>{phase.title}</h3>
                        <p>{phase.outcome}</p>
                      </div>

                      <div className="pf-detail-time">
                        <Icon name="clock" />
                        {phase.estimatedHours}h
                      </div>
                    </div>

                    <div className="pf-detail-meta">
                      <span>{phase.category}</span>
                      <span>{phase.estimatedWeeks} estimated weeks</span>
                    </div>

                    <div className="pf-detail-section">
                      <h4>
                        <Icon name="book" /> Skills to master
                      </h4>

                      <div className="pf-skill-checklist">
                        {phase.skills.map((skill, skillIndex) => {
                          const taskId = `${phase.id}-skill-${skillIndex}`;

                          return (
                            <label
                              className={`pf-skill-item ${
                                completedTasks[taskId] ? "checked" : ""
                              }`}
                              key={taskId}
                            >
                              <input
                                type="checkbox"
                                checked={Boolean(completedTasks[taskId])}
                                onChange={() => toggleTask(taskId)}
                              />

                              <span className="pf-custom-checkbox">
                                {completedTasks[taskId] ? "✓" : ""}
                              </span>

                              <span>{skill}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pf-project-card">
                      <div className="pf-project-icon">
                        <Icon name="project" />
                      </div>

                      <div className="pf-project-copy">
                        <span>PHASE PROJECT</span>
                        <h4>{phase.project}</h4>
                        <p>
                          Completion criteria: produce a working result,
                          document what you learned, and explain your decisions.
                        </p>
                      </div>

                      <label className="pf-project-complete">
                        <input
                          type="checkbox"
                          checked={Boolean(completedProjects[phase.id])}
                          onChange={() => toggleProject(phase.id)}
                        />
                        <span>
                          {completedProjects[phase.id] ? "Completed" : "Mark done"}
                        </span>
                      </label>
                    </div>

                    <div className="pf-resources">
                      <h4>Learning resources</h4>
                      {phase.resources.map((resource) => (
                        <a
                          href={resource.url}
                          key={resource.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {resource.label}
                          <Icon name="arrow" />
                        </a>
                      ))}
                    </div>

                    <div className="pf-phase-navigation">
                      <button
                        type="button"
                        disabled={activePhase === 0}
                        onClick={() => {
                          const previous = activePhase - 1;
                          setActivePhase(previous);
                          setExpandedPhase(previous);
                        }}
                      >
                        Previous phase
                      </button>

                      <button
                        type="button"
                        disabled={activePhase === adjustedPhases.length - 1}
                        onClick={() => {
                          const next = activePhase + 1;
                          setActivePhase(next);
                          setExpandedPhase(next);
                        }}
                      >
                        Next phase <Icon name="arrow" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="pf-next-action">
            <div className="pf-next-action-icon">
              <Icon name="target" />
            </div>

            <div>
              <span>YOUR NEXT BEST ACTION</span>
              <h3>
                {nextTask
                  ? nextTask.skill
                  : "Your roadmap checklist is complete!"}
              </h3>
              <p>
                {nextTask
                  ? `Continue in ${nextTask.phase.title}. Complete the skill and apply it in practice.`
                  : "Review your projects, update your portfolio, and plan your next learning goal."}
              </p>
            </div>

            {nextTask && (
              <button
                type="button"
                onClick={() => {
                  setActivePhase(nextTask.phase.index);
                  setExpandedPhase(nextTask.phase.index);
                }}
              >
                Go to task <Icon name="arrow" />
              </button>
            )}
          </div>

          <p className="pf-disclaimer">
            This roadmap is generated from Pathora's curated starter templates.
            Time estimates are approximate and vary by prior experience,
            practice quality, and project scope. Completing this roadmap does
            not guarantee a job. Progress is currently saved in this browser,
            not to a user account.
          </p>
        </section>
      )}

      {!showRoadmap && (
        <section className="pf-empty-state">
          <div className="pf-empty-icon">
            <Icon name="route" />
          </div>
          <h2>Your next chapter starts with a plan.</h2>
          <p>
            Select your target role and study availability to create a structured
            learning roadmap with skills, projects, resources, and milestones.
          </p>
        </section>
      )}

      <footer className="pf-footer">
        <span>pathora<span>.</span></span>
        <p>Build skills. Create proof. Move forward.</p>
        <Link to="/">Back to Home ↗</Link>
      </footer>
    </div>
  );
}

function levelInfoText(level) {
  return LEVEL_INFO[level]?.label || LEVEL_INFO.Beginner.label;
}

export default Pathfinder;
