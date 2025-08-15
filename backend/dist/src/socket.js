"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = setupSocket;
const socket_io_1 = require("socket.io");
const User_1 = __importDefault(require("./models/User"));
function setupSocket(server) {
    const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    try {
        io.on("connection", (socket) => {
            console.log("Usuário conectado:", socket.id);
            socket.on("updatePosition", async (data) => {
                const { userId, position } = data;
                console.log("Usuário moveu:", userId, position);
                await User_1.default.update({ position }, { where: { id: userId } });
                const allUsersPositions = await User_1.default.findAll();
                io.emit("allPositions", allUsersPositions);
            });
            socket.on("disconnect", () => {
                console.log("Usuário desconectado:", socket.id);
            });
        });
    }
    catch (err) {
        const error = err;
        console.error("Erro ao inicializar o socket.io:", error);
    }
}
//# sourceMappingURL=socket.js.map