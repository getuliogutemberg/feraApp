const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token inválido!", error: err.message });
  }
};

const verifyCategory = (category) => (req, res, next) => {
  if (req.user.category !== category) {
    return res.status(403).json({ message: "Acesso negado! Permissão insuficiente." });
  }
  next();
};

module.exports = { verifyToken, verifyCategory };
