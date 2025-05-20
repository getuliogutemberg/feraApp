const { generateUserByIndex } = require("../middleware/userMiddleware");

const generateUsers = (groupNames, tagNames) => {
    const users = {};
    let id = 1;
  
    // Itera sobre os grupos
    for (const group of groupNames) {
      users[group] = [];
  
      // Itera sobre as tags para cada grupo
      for (const tag of tagNames) {
        const user = generateUserByIndex(id); // Gera o usuário com índice
        users[group].push({ ...user, id, RG: `${group}${tag}` }); // Adiciona RG e id único
        id++;
      }
      users[group].reverse(); // Para ordenar de cima para baixo
    }
  
    return users;
};

module.exports = {
  generateUsers
};