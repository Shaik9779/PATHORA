
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

const Profile = sequelize.define("Profile", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },

  headline: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },

  location: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },

  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  education: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },

  graduationYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  skills: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },

  projects: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },

  targetRoles: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },

  workPreference: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  github: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },

  linkedin: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },

  website: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },

  resumeUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
});

module.exports = Profile;
