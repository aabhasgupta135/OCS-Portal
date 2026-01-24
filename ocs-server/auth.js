const jwt = require("jsonwebtoken");

module.exports = function auth(requiredRole = null) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && user.role !== requiredRole)
        return res.status(403).json({ error: "Forbidden" });

      req.user = user;
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};
