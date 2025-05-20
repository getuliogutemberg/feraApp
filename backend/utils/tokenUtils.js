const jwt = require("jsonwebtoken");

// Função para gerar tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, category: user.category, className: user.className },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};