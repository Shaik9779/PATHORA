
// const jwt = require("jsonwebtoken");

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       message: "Please log in to continue.",
//     });
//   }

//   const token = authHeader.slice(7);

//   if (!process.env.JWT_SECRET) {
//     return res.status(500).json({
//       message: "Authentication is not configured.",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Your existing login route signs the token with userId, not id.
//     if (!decoded.userId) {
//       return res.status(401).json({
//         message: "Invalid authentication token.",
//       });
//     }

//     req.user = {
//       id: decoded.userId,
//       role: decoded.role,
//     };

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Your session has expired. Please log in again.",
//     });
//   }
// }

// module.exports = authenticateToken;


const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token is required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
}

module.exports = authMiddleware;
