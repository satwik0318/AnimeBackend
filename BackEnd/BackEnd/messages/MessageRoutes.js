const express=require('express')
const {userAuth} =require('../Login/Middleware/userAuth')
const {getUsersForSidebar,getMessages,markMessageAsSeen,sendMessage}=require('./MessageController')
const messageRouter=express.Router();
messageRouter.get("/users",userAuth,getUsersForSidebar)
messageRouter.get("/:id",userAuth,getMessages)
messageRouter.put("/marks/:id",userAuth,markMessageAsSeen)
messageRouter.post("/send/:id",userAuth,sendMessage)
module.exports={messageRouter}