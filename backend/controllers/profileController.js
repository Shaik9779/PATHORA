
const User = require("../models/User");
const Profile = require("../models/Profile");

const profileFields = [
  "headline",
  "location",
  "about",
  "education",
  "graduationYear",
  "skills",
  "projects",
  "targetRoles",
  "workPreference",
  "github",
  "linkedin",
  "website",
  "resumeUrl",
];

async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const [profile] = await Profile.findOrCreate({
      where: { userId: user.id },
      defaults: { userId: user.id },
    });

    return res.json({
      profile: {
        ...user.toJSON(),
        ...profile.toJSON(),
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      message: "Unable to fetch profile.",
    });
  }
}

async function updateProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const updates = {};

    for (const field of profileFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
      if (
        typeof req.body.name !== "string" ||
        !req.body.name.trim()
      ) {
        return res.status(400).json({
          message: "Name must not be empty.",
        });
      }

      user.name = req.body.name.trim();
      await user.save();
    }

    const [profile] = await Profile.findOrCreate({
      where: { userId: user.id },
      defaults: { userId: user.id },
    });

    await profile.update(updates);

    return res.json({
      message: "Profile updated successfully.",
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...profile.toJSON(),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Unable to update profile.",
    });
  }
}

module.exports = { getProfile, updateProfile };
