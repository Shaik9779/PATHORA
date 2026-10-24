
const express = require("express");
const { Op } = require("sequelize");

const User = require("../models/user");
const Connection = require("../models/Connection");
const authenticateToken = require("../routes/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

function publicUser(user) {
  if (!user) return null;

  // Keep email and password fields private in the network directory.
  return {
    id: user.id,
    name: user.name,
    role: user.role,
  };
}

async function findUserById(id) {
  return User.findByPk(id, {
    attributes: ["id", "name", "role"],
  });
}

// GET /api/connections?view=discover|incoming|sent|connected
router.get("/", async (req, res) => {
  try {
    const currentUserId = Number(req.user.id);
    const view = req.query.view || "discover";

    if (!Number.isInteger(currentUserId) || currentUserId <= 0) {
      return res.status(401).json({ message: "Invalid user identity." });
    }

    if (view === "discover") {
      const existing = await Connection.findAll({
        where: {
          status: { [Op.in]: ["pending", "accepted"] },
          [Op.or]: [
            { senderId: currentUserId },
            { receiverId: currentUserId },
          ],
        },
        attributes: ["senderId", "receiverId"],
      });

      const excludedIds = new Set([currentUserId]);

      for (const connection of existing) {
        excludedIds.add(Number(connection.senderId));
        excludedIds.add(Number(connection.receiverId));
      }

      const users = await User.findAll({
        where: {
          id: { [Op.notIn]: [...excludedIds] },
        },
        attributes: ["id", "name", "role"],
        order: [["name", "ASC"]],
      });

      return res.json({ users: users.map(publicUser) });
    }

    if (view === "incoming") {
      const requests = await Connection.findAll({
        where: { receiverId: currentUserId, status: "pending" },
        order: [["createdAt", "DESC"]],
      });

      const result = await Promise.all(
        requests.map(async (connection) => ({
          id: connection.id,
          senderId: connection.senderId,
          receiverId: connection.receiverId,
          status: connection.status,
          createdAt: connection.createdAt,
          user: publicUser(await findUserById(connection.senderId)),
        }))
      );

      return res.json({ requests: result });
    }

    if (view === "sent") {
      const requests = await Connection.findAll({
        where: { senderId: currentUserId, status: "pending" },
        order: [["createdAt", "DESC"]],
      });

      const result = await Promise.all(
        requests.map(async (connection) => ({
          id: connection.id,
          senderId: connection.senderId,
          receiverId: connection.receiverId,
          status: connection.status,
          createdAt: connection.createdAt,
          user: publicUser(await findUserById(connection.receiverId)),
        }))
      );

      return res.json({ requests: result });
    }

    if (view === "connected") {
      const connections = await Connection.findAll({
        where: {
          status: "accepted",
          [Op.or]: [
            { senderId: currentUserId },
            { receiverId: currentUserId },
          ],
        },
        order: [["updatedAt", "DESC"]],
      });

      const result = await Promise.all(
        connections.map(async (connection) => {
          const otherUserId =
            Number(connection.senderId) === currentUserId
              ? connection.receiverId
              : connection.senderId;

          return {
            id: connection.id,
            status: connection.status,
            connectedAt: connection.updatedAt,
            user: publicUser(await findUserById(otherUserId)),
          };
        })
      );

      return res.json({
        connections: result.filter((item) => item.user),
      });
    }

    return res.status(400).json({
      message: "Invalid view. Use discover, incoming, sent, or connected.",
    });
  } catch (error) {
    console.error("Get connections error:", error);
    return res.status(500).json({
      message: "Could not load Pathora Network.",
    });
  }
});

// POST /api/connections
// Body: { "receiverId": 123 }
router.post("/", async (req, res) => {
  try {
    const senderId = Number(req.user.id);
    const receiverId = Number(req.body.receiverId);

    if (!Number.isInteger(receiverId) || receiverId <= 0) {
      return res.status(400).json({
        message: "A valid receiverId is required.",
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot send a connection request to yourself.",
      });
    }

    const receiver = await User.findByPk(receiverId, {
      attributes: ["id"],
    });

    if (!receiver) {
      return res.status(404).json({
        message: "That Pathora user does not exist.",
      });
    }

    const existing = await Connection.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      order: [["updatedAt", "DESC"]],
    });

    if (existing && ["pending", "accepted"].includes(existing.status)) {
      return res.status(409).json({
        message:
          existing.status === "accepted"
            ? "You are already connected."
            : "A connection request already exists between these users.",
      });
    }

    // Allow the original sender to retry a previously rejected request.
    if (
      existing &&
      Number(existing.senderId) === senderId &&
      Number(existing.receiverId) === receiverId &&
      existing.status === "rejected"
    ) {
      existing.status = "pending";
      await existing.save();

      return res.status(200).json({
        message: "Connection request sent.",
        request: {
          id: existing.id,
          senderId,
          receiverId,
          status: existing.status,
        },
      });
    }

    const connection = await Connection.create({
      senderId,
      receiverId,
      status: "pending",
    });

    return res.status(201).json({
      message: "Connection request sent.",
      request: {
        id: connection.id,
        senderId: connection.senderId,
        receiverId: connection.receiverId,
        status: connection.status,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "A request between these users already exists.",
      });
    }

    console.error("Send connection request error:", error);
    return res.status(500).json({
      message: "Could not send the connection request.",
    });
  }
});

// PATCH /api/connections/:id
// Body: { "status": "accepted" } or { "status": "rejected" }
router.patch("/:id", async (req, res) => {
  try {
    const receiverId = Number(req.user.id);
    const connectionId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(connectionId) || connectionId <= 0) {
      return res.status(400).json({ message: "Invalid request ID." });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected.",
      });
    }

    const connection = await Connection.findOne({
      where: {
        id: connectionId,
        receiverId,
        status: "pending",
      },
    });

    if (!connection) {
      return res.status(404).json({
        message: "Pending request not found for your account.",
      });
    }

    connection.status = status;
    await connection.save();

    return res.json({
      message:
        status === "accepted"
          ? "Connection request accepted."
          : "Connection request declined.",
      connection: {
        id: connection.id,
        senderId: connection.senderId,
        receiverId: connection.receiverId,
        status: connection.status,
      },
    });
  } catch (error) {
    console.error("Respond to connection request error:", error);
    return res.status(500).json({
      message: "Could not update the connection request.",
    });
  }
});

module.exports = router;
