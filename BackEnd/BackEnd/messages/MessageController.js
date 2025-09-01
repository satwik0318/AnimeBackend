const User = require('../Login/userModel');
const Message = require('./message');
const imagekit = require('../Login/Middleware/ImageKit');
const { getIo, getUserSocketMap } = require('../Socket/SocketChat'); 

const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.userId;
        const filteredUser = await User.find({ _id: { $ne: userId } }).select("-password");
        
        const unseenMessages = {};
        const promises = filteredUser.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                reciverId: userId,
                seen: false
            });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });
        
        await Promise.all(promises);
        res.json({ success: true, users: filteredUser, unseenMessages });
    } catch (error) {
        console.error("getUsersForSidebar error:", error);
        res.json({ success: false, message: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.userId;
        
        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: selectedUserId },
                { senderId: selectedUserId, reciverId: myId }
            ]
        }).sort({ createdAt: 1 });
        
        await Message.updateMany(
            { senderId: selectedUserId, reciverId: myId, seen: false },
            { seen: true }
        );
        
        res.json({ success: true, messages });
    } catch (error) {
        console.error("getMessages error:", error);
        res.json({ success: false, message: error.message });
    }   
};

const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.error("markMessageAsSeen error:", error);
        res.json({ success: false, message: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const reciverId = req.params.id;
        const senderId = req.userId;
        if (!text && !image) {
            return res.json({ success: false, message: "Message text or image is required" });
        }
        let imageUrl = null;
        if (image) {
            try {
                const uploadResponse = await imagekit.upload({
                    file: image,
                    fileName: `message_image_${Date.now()}`
                });
                imageUrl = uploadResponse.url; 
                console.log("Image uploaded:", imageUrl);
            } catch (uploadError) {
                return res.json({ success: false, message: "Failed to upload image" });
            }
        }
        
        const newMessage = await Message.create({
            senderId,
            reciverId,
            text: text || "",
            image: imageUrl
        });
        // Get socket info
        const io = getIo();
        const userSocketMap = getUserSocketMap(); 
        const receiverSocketId = userSocketMap[reciverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        } else {
            console.log("❌ Receiver not online:", reciverId);
        }
        
        res.json({ success: true, newMessage });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

module.exports = {
    getUsersForSidebar,
    getMessages,
    markMessageAsSeen,
    sendMessage
};