const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET || "secret";

function tokenFor(user) {
  return jwt.sign(
    { username: user.username, id: user.id },
    SECRET,
    { expiresIn: 60 * 60 * 24 * 7 }, // 7 days
  );
}

function tokenExtractor(req, _res, next) {
  const auth = req.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    try {
      req.token = auth.substring(7);
      req.user = jwt.verify(req.token, SECRET);
    } catch {
      req.token = null;
      req.user = null;
    }
  } else {
    req.token = null;
    req.user = null;
  }
  next();
}

// Express middleware: rejects requests that are not authenticated.
function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  next();
}

module.exports = { SECRET, tokenFor, tokenExtractor, requireAuth };
