
const { Sequelize } = require("sequelize");
const fs = require("fs");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const dialectOptions = {};

if (isProduction) {
  dialectOptions.ssl = {
    ca: fs.readFileSync("/etc/secrets/aiven-ca.pem", "utf8"),
    rejectUnauthorized: true,
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
    dialectOptions,
  }
);

module.exports = sequelize;
