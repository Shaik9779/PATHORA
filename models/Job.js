
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    company: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    location: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "Remote",
    },

    jobType: {
      type: DataTypes.ENUM(
        "Full-time",
        "Part-time",
        "Internship",
        "Contract"
      ),
      allowNull: false,
      defaultValue: "Internship",
    },

    workMode: {
      type: DataTypes.ENUM("Remote", "Hybrid", "On-site"),
      allowNull: false,
      defaultValue: "Remote",
    },

    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Software Development",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    skills: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    salaryMin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },

    salaryMax: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },

    salaryPeriod: {
      type: DataTypes.ENUM("Year", "Month", "Hour", "Stipend"),
      allowNull: true,
      defaultValue: "Month",
    },

    applicationDeadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    experienceLevel: {
      type: DataTypes.ENUM("Fresher", "Entry-level", "Experienced"),
      allowNull: false,
      defaultValue: "Fresher",
    },

    openings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },

    status: {
      type: DataTypes.ENUM("Open", "Closed", "Draft"),
      allowNull: false,
      defaultValue: "Open",
    },

    recruiterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
    indexes: [
      { fields: ["status"] },
      { fields: ["jobType"] },
      { fields: ["location"] },
      { fields: ["recruiterId"] },
    ],
  }
);

module.exports = Job;
