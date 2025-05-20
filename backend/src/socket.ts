import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import User from "./models/User";

interface UpdatePositionData {
  userId: string;
  position: [number, number];
}

export function setupSocket(server: HttpServer): void {
  const io = new SocketServer(server, { cors: { origin: "*" } });
  
  try {
    io.on("connection", (socket) => {
      console.log("Usuário conectado:", socket.id);
    
      socket.on("updatePosition", async (data: UpdatePositionData) => {
        const { userId, position } = data;
        console.log("Usuário moveu:", userId, position);
        
        await User.update({ position }, { where: { id: userId } });
        const allUsersPositions = await User.findAll();
    
        // Broadcast para todos os usuários conectados
        io.emit("allPositions", allUsersPositions);
      });
    
      socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.id);
      });
    });
  } catch (err) {
    const error = err as Error;
    console.error("Erro ao inicializar o socket.io:", error);
  }
}