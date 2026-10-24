
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Connection = sequelize.define(
  "Connection",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "Connections",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["senderId", "receiverId"],
      },
    ],
    validate: {
      differentUsers() {
        if (this.senderId === this.receiverId) {
          throw new Error("You cannot connect with yourself.");
        }
      },
    },
  }
);

module.exports = Connection;
