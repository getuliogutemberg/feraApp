const jwt = require("jsonwebtoken");

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifique se sua chave secreta está correta
    req.user = decoded;  // Defina o usuário no request com os dados do token
    next();
  } catch (err) {
    res.status(400).json({ message: "Token inválido!", error: err.message });
  }
};

// Middleware para verificar categoria
const verifyCategory = (category) => (req, res, next) => {
  if (req.user.category !== category) {
    return res.status(403).json({ message: "Acesso negado! Permissão insuficiente." });
  }
  next();
};

module.exports = { verifyToken, verifyCategory };
