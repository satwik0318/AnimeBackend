let io;
let userSocketMap = {}; // userId -> socketId mapping

const initializeSocket = (socketIo) => {
    io = socketIo;
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            // Store the mapping
            userSocketMap[userId] = socket.id;
            
            // Emit online users to all clients
            io.emit("getOnlineusers", Object.keys(userSocketMap));
        }
        
        // Handle disconnect
        socket.on("disconnect", () => {
            // Remove user from mapping
            for (const [userId, socketId] of Object.entries(userSocketMap)) {
                if (socketId === socket.id) {
                    delete userSocketMap[userId];
                    break;
                }
            }
            
            // Emit updated online users
            io.emit("getOnlineusers", Object.keys(userSocketMap));
        });

        // Handle typing event
        socket.on("typing", ({ receiverId, isTyping }) => {
            const receiverSocketId = userSocketMap[receiverId];
            if (receiverSocketId) {
                socket.to(receiverSocketId).emit("typing", { senderId: userId, isTyping });
            }
        });
    });
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized!");
    }
    return io;
};

const getUserSocketMap = () => {
    return userSocketMap;
};

module.exports = {
    initializeSocket,
    getIo,
    getUserSocketMap
};
