const { Server } = require("socket.io");


const { User } = require("./models/User");



const io = (server) => {
  const socketIo = new Server(server, { cors: { origin: "*" } });
  socketIo.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);

    socket.on("updatePosition", async ({ userId, position }) => {
      console.log("Usuário moveu:", userId, position);
      await User.findByIdAndUpdate(userId, { position });
      const allUsersPositions = await User.find();
      const allPositions = await Position.find();

      // Broadcast para todos os usuários conectados
      io.emit("allPositions", [...allPositions, ...allUsersPositions]);
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.id);
    });
  })
  
  }


module.exports = io
