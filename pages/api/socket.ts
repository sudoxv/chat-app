import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";

const secretKey = "hidupblonde";

export default const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const io = new Server(req.socket.server);
    
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Unauthorized"));
        
        try {
            const decoded = verify(token, secretKey);
            socket.user = decoded;
            next();
        } catch (e) {
            next(new Error("Unauthorized"));
        }
    });
    
    io.on("connection", (sock) => {
        console.log("Client connected");
        
        sock.on("disconnet", () => {
            console.log("Client disconnected");
        });
        
        sock.on("message", (msg) => {
            console.log("Received message:", msg);
            io.emit("message", msg);
        });
    });
    
    return res.end();
}
