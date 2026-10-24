
import { useMemo, useState } from "react";
import "./Practice.css";

const CATEGORIES = [
  { name: "DSA & Coding", icon: "⌘", description: "Algorithms and problem solving", tone: "violet" },
  { name: "Aptitude", icon: "◈", description: "Quantitative and logical reasoning", tone: "blue" },
  { name: "Technical MCQs", icon: "▤", description: "CS fundamentals and concepts", tone: "green" },
];

const QUESTIONS = [
  { id: 1, category: "DSA & Coding", title: "Find the largest element", topic: "Arrays", difficulty: "Easy", prompt: "Given an array of integers, return the largest element.", sample: "[4, 9, 2, 7]", expected: "9", hints: ["Start with the first element as the largest.", "Compare every element with the current largest."], python: "arr = [4, 9, 2, 7]\n# Find and print the largest element", java: "public class Main {\n    public static void main(String[] args) {\n        int[] arr = {4, 9, 2, 7};\n        // Find and print the largest element\n    }\n}" },
  { id: 2, category: "DSA & Coding", title: "Move zeros to the end", topic: "Arrays", difficulty: "Easy", prompt: "Move all zeros to the end while preserving the order of nonzero elements.", sample: "[0, 1, 0, 3, 12]", expected: "[1, 3, 12, 0, 0]", hints: ["Think about collecting nonzero values first.", "Try solving it without sorting."], python: "arr = [0, 1, 0, 3, 12]\n# Move zeros to the end\nprint(arr)", java: "import java.util.Arrays;\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {0, 1, 0, 3, 12};\n        // Move zeros to the end\n        System.out.println(Arrays.toString(arr));\n    }\n}" },
  { id: 3, category: "DSA & Coding", title: "Two Sum", topic: "Arrays / Hash Map", difficulty: "Easy", prompt: "Find the indices of two elements whose sum equals the target.", sample: "nums = [2, 7, 11, 15], target = 9", expected: "[0, 1]", hints: ["For each number, ask what complement you need.", "A hash map can reduce repeated searching."], python: "nums = [2, 7, 11, 15]\ntarget = 9\n# Find the two indices", java: "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {2, 7, 11, 15};\n        int target = 9;\n        // Find the two indices\n    }\n}" },
    { id: 4, category: "DSA & Coding", title: "Reverse a string", topic: "Strings", difficulty: "Easy", prompt: "Reverse a string without using a built-in reverse method.", sample: '"pathora"', expected: '"arohtap"', hints: ["Use two pointers or build the result from the end.", "Check the first and last characters."], python: 'text = "pathora"\n# Reverse without a built-in reverse method', java: 'public class Main {\n    public static void main(String[] args) {\n        String text = "pathora";\n        // Reverse the string\n    }\n}' },
  { id: 6, category: "DSA & Coding", title: "Count character frequency", topic: "Hash Map", difficulty: "Easy", prompt: "Count how many times each character appears in a string.", sample: '"abcbb"', expected: '{a: 1, b: 3, c: 1}', hints: ["Use a map from character to count.", "Update the count each time a character appears."], python: 'text = "abcbb"\n# Count each character', java: 'import java.util.HashMap;\npublic class Main {\n    public static void main(String[] args) {\n        String text = "abcbb";\n        // Count each character\n    }\n}' },
  { id: 7, category: "DSA & Coding", title: "Binary search", topic: "Searching", difficulty: "Easy", prompt: "Find a target in a sorted array using binary search.", sample: "arr = [1, 3, 5, 7, 9], target = 7", expected: "Index 3", hints: ["Use low, high, and mid.", "Discard half the search space each iteration."], python: "arr = [1, 3, 5, 7, 9]\ntarget = 7\n# Implement binary search", java: "public class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 3, 5, 7, 9};\n        int target = 7;\n        // Implement binary search\n    }\n}" },
  { id: 8, category: "DSA & Coding", title: "Second-largest element", topic: "Arrays", difficulty: "Easy", prompt: "Find the second-largest distinct value in an array.", sample: "[10, 5, 8, 10, 3]", expected: "8", hints: ["Track the largest and second-largest.", "Do not count duplicates of the largest."], python: "arr = [10, 5, 8, 10, 3]\n# Find the second-largest distinct value", java: "public class Main {\n    public static void main(String[] args) {\n        int[] arr = {10, 5, 8, 10, 3};\n        // Find the second-largest distinct value\n    }\n}" },
  { id: 9, category: "DSA & Coding", title: "Valid parentheses", topic: "Stack", difficulty: "Medium", prompt: "Determine whether every opening bracket has a correctly ordered closing bracket.", sample: '"({[]})"', expected: "True", hints: ["A stack remembers the most recent opening bracket.", "The closing bracket must match the top of the stack."], python: 'text = "({[]})"\n# Validate the brackets', java: 'import java.util.Stack;\npublic class Main {\n    public static void main(String[] args) {\n        String text = "({[]})";\n        // Validate the brackets\n    }\n}' },
  { id: 10, category: "DSA & Coding", title: "Maximum subarray sum", topic: "Kadane's Algorithm", difficulty: "Medium", prompt: "Find the largest sum of any non-empty contiguous subarray.", sample: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", expected: "6", hints: ["At each position, decide whether to extend or restart.", "Keep track of the best sum seen so far."], python: "arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n# Find the maximum subarray sum", java: "public class Main {\n    public static void main(String[] args) {\n        int[] arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};\n        // Find the maximum subarray sum\n    }\n}" },
  { id: 11, category: "DSA & Coding", title: "Merge two sorted arrays", topic: "Two Pointers", difficulty: "Medium", prompt: "Merge two sorted arrays into one sorted array.", sample: "[1, 3, 5] and [2, 4, 6]", expected: "[1, 2, 3, 4, 5, 6]", hints: ["Compare the current element from each array.", "Advance the pointer of the smaller element."], python: "a = [1, 3, 5]\nb = [2, 4, 6]\n# Merge the arrays", java: "import java.util.Arrays;\npublic class Main {\n    public static void main(String[] args) {\n        int[] a = {1, 3, 5};\n        int[] b = {2, 4, 6};\n        // Merge the arrays\n    }\n}" },
  { id: 12, category: "DSA & Coding", title: "Remove duplicates from sorted array", topic: "Arrays", difficulty: "Easy", prompt: "Remove duplicates in-place from a sorted array and count the unique values.", sample: "[1, 1, 2, 2, 3]", expected: "3 unique values: [1, 2, 3]", hints: ["Sorted order means duplicates are adjacent.", "Use a pointer for the next unique position."], python: "arr = [1, 1, 2, 2, 3]\n# Remove duplicates", java: "public class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 1, 2, 2, 3};\n        // Remove duplicates\n    }\n}" },
  { id: 13, category: "DSA & Coding", title: "First non-repeating character", topic: "Hash Map / Strings", difficulty: "Medium", prompt: "Find the first character that appears exactly once.", sample: '"aabbcdde"', expected: '"c"', hints: ["Count every character first.", "Then scan the string in its original order."], python: 'text = "aabbcdde"\n# Find the first non-repeating character', java: 'public class Main {\n    public static void main(String[] args) {\n        String text = "aabbcdde";\n        // Find the first non-repeating character\n    }\n}' },
  { id: 14, category: "DSA & Coding", title: "FizzBuzz", topic: "Loops / Conditions", difficulty: "Easy", prompt: "For numbers 1 to 15, print Fizz for multiples of 3, Buzz for multiples of 5, and FizzBuzz for both.", sample: "Numbers 1 through 5", expected: "1, 2, Fizz, 4, Buzz", hints: ["Check divisibility by both 3 and 5 first.", "Use the remainder operator."], python: "# Print FizzBuzz from 1 to 15", java: "public class Main {\n    public static void main(String[] args) {\n        // Print FizzBuzz from 1 to 15\n    }\n}" },
  { id: 15, category: "DSA & Coding", title: "Two Sum in a sorted array", topic: "Two Pointers", difficulty: "Medium", prompt: "Return the pair of values in a sorted array that sum to a target.", sample: "arr = [1, 2, 4, 6, 10], target = 8", expected: "[2, 6]", hints: ["Start with left and right pointers.", "Move left up if the sum is too small; move right down if too large."], python: "arr = [1, 2, 4, 6, 10]\ntarget = 8\n# Find the pair", java: "public class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 4, 6, 10};\n        int target = 8;\n        // Find the pair\n    }\n}" },
  { id: 16, category: "Aptitude", title: "Percentage increase", topic: "Percentages", difficulty: "Easy", prompt: "A product price increases from ₹800 to ₹1,000. What is the percentage increase?", options: ["20%", "25%", "30%", "40%"], answer: 1, explanation: "Increase = 1,000 − 800 = 200. Percentage increase = (200 / 800) × 100 = 25%." },
  { id: 17, category: "Aptitude", title: "Profit and loss", topic: "Arithmetic", difficulty: "Easy", prompt: "An item costs ₹500 and sells for ₹600. What is the profit percentage on cost price?", options: ["10%", "15%", "20%", "25%"], answer: 2, explanation: "Profit = ₹100. Profit percentage = (100 / 500) × 100 = 20%." },
  { id: 18, category: "Aptitude", title: "Average of numbers", topic: "Averages", difficulty: "Easy", prompt: "The average of 5 numbers is 18. What is their total?", options: ["80", "85", "90", "95"], answer: 2, explanation: "Total = average × number of values = 18 × 5 = 90." },
  { id: 19, category: "Aptitude", title: "Work and time", topic: "Time and Work", difficulty: "Medium", prompt: "A person completes a job in 10 days. At the same rate, what fraction is completed in 4 days?", options: ["1/5", "2/5", "1/2", "4/5"], answer: 1, explanation: "Work completed = 4/10 = 2/5 of the job." },
  { id: 20, category: "Aptitude", title: "Speed and distance", topic: "Time, Speed & Distance", difficulty: "Easy", prompt: "A car travels at 60 km/h for 2.5 hours. How far does it travel?", options: ["120 km", "140 km", "150 km", "180 km"], answer: 2, explanation: "Distance = speed × time = 60 × 2.5 = 150 km." },
  { id: 21, category: "Aptitude", title: "Ratio and proportion", topic: "Ratios", difficulty: "Easy", prompt: "Two quantities are in the ratio 2:3 and their sum is 40. What is the smaller quantity?", options: ["12", "16", "20", "24"], answer: 1, explanation: "Total parts = 5. Each part = 40/5 = 8. Smaller quantity = 2 × 8 = 16." },
  { id: 22, category: "Aptitude", title: "Number series", topic: "Logical Reasoning", difficulty: "Medium", prompt: "Find the next number: 2, 6, 12, 20, 30, ?", options: ["36", "40", "42", "44"], answer: 2, explanation: "The differences are 4, 6, 8, 10. The next difference is 12, so the answer is 42." },
  { id: 23, category: "Aptitude", title: "Simple interest", topic: "Interest", difficulty: "Easy", prompt: "Find the simple interest on ₹2,000 at 5% per year for 3 years.", options: ["₹200", "₹250", "₹300", "₹350"], answer: 2, explanation: "SI = P × R × T / 100 = 2,000 × 5 × 3 / 100 = ₹300." },
  { id: 24, category: "Aptitude", title: "Probability basics", topic: "Probability", difficulty: "Medium", prompt: "A fair six-sided die is rolled once. What is the probability of rolling an even number?", options: ["1/6", "1/3", "1/2", "2/3"], answer: 2, explanation: "Even outcomes are 2, 4, and 6. Probability = 3/6 = 1/2." },
  { id: 25, category: "Technical MCQs", title: "OOP: Encapsulation", topic: "Object-Oriented Programming", difficulty: "Easy", prompt: "What best describes encapsulation?", options: ["Hiding internal state behind a controlled interface", "Making every variable global", "Repeating code in every class", "Sorting an array"], answer: 0, explanation: "Encapsulation bundles state and behavior and controls access to internal details." },
  { id: 26, category: "Technical MCQs", title: "Database primary key", topic: "DBMS", difficulty: "Easy", prompt: "What is the main purpose of a primary key?", options: ["Allow duplicate rows", "Uniquely identify each row", "Encrypt the database", "Sort every query automatically"], answer: 1, explanation: "A primary key uniquely identifies each row in a table and cannot contain NULL values." },
  { id: 27, category: "Technical MCQs", title: "SQL filtering", topic: "SQL", difficulty: "Easy", prompt: "Which SQL clause filters rows before grouping?", options: ["ORDER BY", "HAVING", "WHERE", "LIMIT"], answer: 2, explanation: "WHERE filters individual rows before GROUP BY. HAVING filters grouped results." },
  { id: 28, category: "Technical MCQs", title: "Operating system process", topic: "Operating Systems", difficulty: "Medium", prompt: "What is a process?", options: ["A program in execution", "A database column", "A type of network cable", "A source-code comment"], answer: 0, explanation: "A process is a running instance of a program with its own execution state and resources." },
  { id: 29, category: "Technical MCQs", title: "HTTP status 404", topic: "Computer Networks / Web", difficulty: "Easy", prompt: "What does HTTP status code 404 mean?", options: ["Success", "Unauthorized", "Not Found", "Server is permanently unavailable"], answer: 2, explanation: "404 Not Found means the server could not find the requested resource." },
  { id: 30, category: "Technical MCQs", title: "Stack principle", topic: "Data Structures", difficulty: "Easy", prompt: "Which principle does a stack follow?", options: ["FIFO", "LIFO", "Random access only", "First sorted, first removed"], answer: 1, explanation: "A stack follows Last In, First Out: the last item added is the first item removed." },
];

const COMPANIES = [
  { name: "TCS", focus: "Quantitative aptitude, reasoning, verbal ability, and coding", details: "Practice percentages, ratios, number series, time and work, and basic programming. Exact assessment patterns can vary by role and hiring cycle.", tone: "violet" },
  { name: "Infosys", focus: "Logical reasoning, quantitative ability, and problem solving", details: "Build speed with arithmetic, puzzles, data interpretation, and coding fundamentals. Check the current official recruitment instructions for the role.", tone: "blue" },
  { name: "Accenture", focus: "Numerical reasoning, analytical thinking, and technical skills", details: "Practice arithmetic, pattern recognition, communication, and role-specific technical questions. The selection process can differ by position.", tone: "green" },
  { name: "Amazon", focus: "DSA, problem solving, and role-related fundamentals", details: "For software roles, prioritize arrays, strings, hash maps, trees, complexity analysis, and behavioral stories using the Leadership Principles.", tone: "orange" },
];

const STARTER_CODE = {
  Python: 'nums = [2, 7, 11, 15]\ntarget = 9\n\n# Write your solution\n',
  Java: 'public class Main {\n    public static void main(String[] args) {\n        int[] nums = {2, 7, 11, 15};\n        int target = 9;\n\n        // Write your solution\n    }\n}',
};

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem("pathora_practice_progress") || "{}");
  } catch {
    return {};
  }
}

export default function Practice() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [completed, setCompleted] = useState(readProgress);
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(STARTER_CODE.Python);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return QUESTIONS.filter((question) => {
      const matchesCategory =
        selectedCategory === "All" || question.category === selectedCategory;
      const matchesDifficulty =
        difficulty === "All" || question.difficulty === difficulty;
      const matchesSearch =
        !query ||
        `${question.title} ${question.topic} ${question.category}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, difficulty, search]);

  const codingQuestions = QUESTIONS.filter((q) => q.category === "DSA & Coding");
  const completedCount = Object.values(completed).filter(Boolean).length;

  function markCompleted(id) {
    const next = { ...completed, [id]: true };
    setCompleted(next);
    try {
      localStorage.setItem("pathora_practice_progress", JSON.stringify(next));
    } catch {
      // Progress remains available in this page session.
    }
  }

  function chooseLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setCode(STARTER_CODE[nextLanguage]);
    setOutput("");
  }

  async function runCode() {
    setRunning(true);
    setOutput("Connecting to the code execution service…");

    try {
      const response = await fetch("http://localhost:5000/api/practice/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Code execution is not available.");
      }

      setOutput(data.output || data.stderr || "Program finished with no output.");
    } catch (error) {
      setOutput(
        `${error.message}\n\nThe code runner endpoint must be configured on your backend before code can execute. Your code has not been run.`
      );
    } finally {
      setRunning(false);
    }
  }

  function openQuestion(question) {
    setSelectedQuestion(question);
    setOutput("");
    if (question.category === "DSA & Coding") {
      setCode(language === "Python" ? question.python : question.java);
    }
  }

  function selectCategory(category) {
    setSelectedCategory(category);
    setSelectedQuestion(null);
  }

  return (
    <main className="practice-page">
      <section className="practice-hero">
        <div className="practice-hero-copy">
          <span className="practice-eyebrow">PATHORA · PRACTICE ARENA</span>
          <h1>
            Train today.
            <br />
            <span>Be interview-ready tomorrow.</span>
          </h1>
          <p>
            Sharpen your coding, aptitude, and technical fundamentals with
            focused practice designed for your placement journey.
          </p>
          <div className="practice-hero-actions">
            <button
              className="practice-primary-button"
              onClick={() => openQuestion(codingQuestions[0])}
            >
              Start coding <span>↗</span>
            </button>
            <button
              className="practice-secondary-button"
              onClick={() => {
                setSelectedCategory("Aptitude");
                setSelectedQuestion(null);
              }}
            >
              Practice aptitude
            </button>
          </div>
        </div>
        <div className="practice-hero-art" aria-hidden="true">
          <div className="practice-art-ring ring-one" />
          <div className="practice-art-ring ring-two" />
          <div className="practice-art-core">{"</>"}</div>
          <span className="practice-art-chip chip-one">DSA</span>
          <span className="practice-art-chip chip-two">PY</span>
          <span className="practice-art-chip chip-three">0101</span>
        </div>
      </section>

      <section className="practice-metrics">
        <article><span>Available questions</span><strong>{QUESTIONS.length}</strong><small>Across 3 categories</small></article>
        <article><span>Coding challenges</span><strong>{codingQuestions.length}</strong><small>Python and Java starter templates</small></article>
        <article><span>Completed</span><strong>{completedCount}</strong><small>Saved practice progress</small></article>
        <article><span>Company guides</span><strong>{COMPANIES.length}</strong><small>Preparation focus areas</small></article>
      </section>

      <section className="practice-section">
        <div className="practice-section-heading">
          <div>
            <span className="practice-eyebrow">YOUR TRAINING TRACKS</span>
            <h2>Choose your focus</h2>
            <p>Pick a track and start building confidence.</p>
          </div>
        </div>

        <div className="practice-category-grid">
          {CATEGORIES.map((category) => (
            <button
              key={category.name}
              className={`practice-category-card ${category.tone} ${selectedCategory === category.name ? "selected" : ""}`}
              onClick={() => selectCategory(category.name)}
            >
              <span className="practice-category-icon">{category.icon}</span>
              <span className="practice-card-count">
                {QUESTIONS.filter((q) => q.category === category.name).length} questions
              </span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="practice-card-link">Explore track ↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="practice-section practice-library">
        <div className="practice-section-heading practice-library-heading">
          <div>
            <span className="practice-eyebrow">THE QUESTION LIBRARY</span>
            <h2>Find your next challenge</h2>
            <p>Choose a question, try it yourself, then review your progress.</p>
          </div>
          <span className="practice-result-count">{filteredQuestions.length} questions</span>
        </div>

        <div className="practice-toolbar">
          <input
            className="practice-search"
            type="search"
            placeholder="Search by question, topic, or category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} aria-label="Filter by difficulty">
            <option value="All">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="practice-filter-row">
          {["All", ...CATEGORIES.map((category) => category.name)].map((category) => (
            <button
              key={category}
              className={`practice-filter-chip ${selectedCategory === category ? "active" : ""}`}
              onClick={() => selectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="practice-question-list">
          {filteredQuestions.map((question, index) => (
            <article className="practice-question-row" key={question.id}>
              <span className="practice-question-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="practice-question-main">
                <div className="practice-question-tags">
                  <span>{question.category}</span>
                  <span>{question.topic}</span>
                </div>
                <h3>{question.title}</h3>
                <p>{question.prompt}</p>
              </div>
              <span className={`practice-difficulty ${question.difficulty.toLowerCase()}`}>
                {question.difficulty}
              </span>
              {completed[question.id] && <span className="practice-done-mark">✓</span>}
              <button className="practice-open-question" onClick={() => openQuestion(question)}>
                Solve <span>↗</span>
              </button>
            </article>
          ))}
          {filteredQuestions.length === 0 && (
            <div className="practice-empty">
              <h3>No matching questions</h3>
              <p>Try another search or reset your filters.</p>
              <button onClick={() => { setSearch(""); setDifficulty("All"); setSelectedCategory("All"); }}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="practice-company-section">
        <div className="practice-section-heading">
          <div>
            <span className="practice-eyebrow">PLACEMENT PREPARATION</span>
            <h2>Prepare with a company in mind</h2>
            <p>Use these as study guides, not guaranteed or official test patterns.</p>
          </div>
          <button className="practice-text-button" onClick={() => setShowCompanies(!showCompanies)}>
            {showCompanies ? "Show less" : "Explore companies"} ↗
          </button>
        </div>

        <div className="practice-company-grid">
          {COMPANIES.slice(0, showCompanies ? COMPANIES.length : 4).map((company) => (
            <article className={`practice-company-card ${company.tone}`} key={company.name}>
              <div className="practice-company-top">
                <span className="practice-company-monogram">{company.name.slice(0, 1)}</span>
                <span className="practice-company-label">STUDY GUIDE</span>
              </div>
              <h3>{company.name}</h3>
              <strong>{company.focus}</strong>
              <p>{company.details}</p>
              <button onClick={() => {
                setSelectedCategory(company.name === "Amazon" ? "DSA & Coding" : "Aptitude");
                setSearch("");
                setDifficulty("All");
                document.querySelector(".practice-library")?.scrollIntoView({ behavior: "smooth" });
              }}>
                Practice relevant questions ↗
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedQuestion && (
        <div className="practice-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedQuestion(null);
        }}>
          <section className="practice-modal" role="dialog" aria-modal="true" aria-labelledby="practice-modal-title">
            <button className="practice-modal-close" onClick={() => setSelectedQuestion(null)} aria-label="Close">×</button>

            <div className="practice-modal-meta">
              <span>{selectedQuestion.category}</span>
              <span className={`practice-difficulty ${selectedQuestion.difficulty.toLowerCase()}`}>{selectedQuestion.difficulty}</span>
            </div>
            <h2 id="practice-modal-title">{selectedQuestion.title}</h2>
            <p className="practice-modal-topic">{selectedQuestion.topic}</p>
            <p className="practice-modal-prompt">{selectedQuestion.prompt}</p>

            {selectedQuestion.category === "DSA & Coding" ? (
              <>
                <div className="practice-example">
                  <div><span>Sample input</span><code>{selectedQuestion.sample}</code></div>
                  <div><span>Expected result</span><code>{selectedQuestion.expected}</code></div>
                </div>

                <div className="practice-editor-heading">
                  <div><span className="practice-editor-dot" /> Code workspace</div>
                  <select value={language} onChange={(event) => chooseLanguage(event.target.value)} aria-label="Programming language">
                    <option value="Python">Python 3</option>
                    <option value="Java">Java</option>
                  </select>
                </div>

                <textarea
                  className="practice-code-editor"
                  spellCheck="false"
                  autoCapitalize="off"
                  autoCorrect="off"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  aria-label="Code editor"
                />

                <div className="practice-editor-actions">
                  <button className="practice-secondary-button" onClick={() => {
                    setCode(language === "Python" ? selectedQuestion.python : selectedQuestion.java);
                    setOutput("");
                  }}>
                    Reset code
                  </button>
                  <button className="practice-primary-button" disabled={running} onClick={runCode}>
                    {running ? "Running..." : "▶ Run code"}
                  </button>
                </div>

                <div className="practice-output">
                  <div className="practice-output-title"><span /> Terminal output</div>
                  <pre>{output || "Output will appear here after the code runner is configured."}</pre>
                </div>

                <details className="practice-hints">
                  <summary>Need a hint?</summary>
                  <ol>{selectedQuestion.hints.map((hint) => <li key={hint}>{hint}</li>)}</ol>
                </details>
              </>
            ) : (
              <div className="practice-mcq">
                <p className="practice-mcq-label">SELECT ONE ANSWER</p>
                {selectedQuestion.options.map((option, index) => {
                  const picked = answers[selectedQuestion.id] === index;
                  const isRevealed = revealed[selectedQuestion.id];
                  const correct = index === selectedQuestion.answer;
                  return (
                    <button
                      key={option}
                      className={`practice-option ${picked ? "picked" : ""} ${isRevealed && correct ? "correct" : ""} ${isRevealed && picked && !correct ? "incorrect" : ""}`}
                      onClick={() => {
                        setAnswers((prev) => ({ ...prev, [selectedQuestion.id]: index }));
                        setRevealed((prev) => ({ ...prev, [selectedQuestion.id]: false }));
                      }}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>{option}
                    </button>
                  );
                })}
                <button className="practice-primary-button practice-check-answer" disabled={answers[selectedQuestion.id] == null} onClick={() => {
                  setRevealed((prev) => ({ ...prev, [selectedQuestion.id]: true }));
                  if (answers[selectedQuestion.id] === selectedQuestion.answer) markCompleted(selectedQuestion.id);
                }}>
                  Check answer
                </button>
                {revealed[selectedQuestion.id] && (
                  <div className={`practice-explanation ${answers[selectedQuestion.id] === selectedQuestion.answer ? "right" : "wrong"}`}>
                    <strong>{answers[selectedQuestion.id] === selectedQuestion.answer ? "Correct answer!" : "Not quite — review this explanation."}</strong>
                    <p>{selectedQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}

            <div className="practice-modal-footer">
              {selectedQuestion.category === "DSA & Coding" && (
                <button className="practice-mark-complete" onClick={() => markCompleted(selectedQuestion.id)}>
                  {completed[selectedQuestion.id] ? "✓ Completed" : "Mark as completed"}
                </button>
              )}
              <button className="practice-text-button" onClick={() => setSelectedQuestion(null)}>Close</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
