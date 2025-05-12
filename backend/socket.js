const { Server } = require("socket.io");


const { User } = require("./models/User");



const io = (server) => {
  const socketIo = new Server(server, { cors: { origin: "*" } });
  socketIo.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);

    socket.on("updatePosition", async ({ userId, position }) => {
      console.log("Usuário moveu:", userId, position);
      await User.update({ position }, { where: { id: userId } });
      const allUsersPositions = await User.findAll();
      const allPositions = await Position.findAll();

      // Broadcast para todos os usuários conectados
      io.emit("allPositions", [...allPositions, ...allUsersPositions]);
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.id);
    });
  })
  
  }


module.exports = io
