
const express = require("express");
const router = express.Router();

const Job = require("../models/Job");
const authMiddleware = require("./authMiddleware");

// GET /api/jobs — Get all open jobs
router.get("/", async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      workMode,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    const { Op } = require("sequelize");
    const where = { status: "Open" };

    if (search && search.trim()) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search.trim()}%` } },
        { company: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    if (location && location.trim()) {
      where.location = { [Op.like]: `%${location.trim()}%` };
    }

    if (jobType) where.jobType = jobType;
    if (workMode) where.workMode = workMode;
    if (category) where.category = category;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(limit, 10) || 10)
    );

    const result = await Job.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

    res.json({
      jobs: result.rows,
      pagination: {
        total: result.count,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(result.count / pageSize),
      },
    });
  } catch (error) {
    console.error("Fetch jobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs." });
  }
});

// GET /api/jobs/:id — Get one open job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findOne({
      where: {
        id: req.params.id,
        status: "Open",
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.json({ job });
  } catch (error) {
    console.error("Fetch job error:", error);
    res.status(500).json({ message: "Failed to fetch job." });
  }
});

// POST /api/jobs — Recruiters can create jobs
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can post jobs.",
      });
    }

    const {
      title,
      company,
      location,
      jobType,
      workMode,
      category,
      description,
      requirements,
      skills,
      salaryMin,
      salaryMax,
      salaryPeriod,
      applicationDeadline,
      experienceLevel,
      openings,
    } = req.body;

    if (
      !title?.trim() ||
      !company?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        message: "Title, company, and description are required.",
      });
    }

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location,
      jobType,
      workMode,
      category,
      description: description.trim(),
      requirements,
      skills,
      salaryMin,
      salaryMax,
      salaryPeriod,
      applicationDeadline,
      experienceLevel,
      openings,
      recruiterId: req.user.id,
      status: "Open",
    });

    res.status(201).json({
      message: "Job posted successfully.",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(400).json({
      message: "Could not create job. Check the submitted fields.",
    });
  }
});

module.exports = router;
