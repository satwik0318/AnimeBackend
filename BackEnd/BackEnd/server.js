const express=require('express')
const cors = require('cors');
require('./db/connect');
const http =require('http')
const cookieParser = require('cookie-parser');
const commentRoutes = require('./Comments/comment'); 
const authRouter =require('./Login/authRoutes');
const userRouter = require('./Login/userRouter');
const { messageRouter } = require('./messages/MessageRoutes');
const {anime} =require('./Anime/animeRoute')
const {Server} =require('socket.io')
const {initializeSocket} =require('./Socket/SocketChat')
const app = express()
const PORT = process.env.PORT || 5000;
const allowedOrigins=['http://localhost:5173']
const httpServer=http.createServer(app)
const io=new Server(httpServer,{
  cors:{
    origin:allowedOrigins[0],
    credentials:true
  }
})
// store online users
initializeSocket(io)
app.use(cors({
  origin: allowedOrigins[0],
  credentials:true})
);
app.use(express.json());
app.use(cookieParser())
app.use('/', commentRoutes);
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use("/api/messages",messageRouter)
app.use("/api/anime", anime);
httpServer.listen(PORT, () => {
  console.log(`Server/api/user/data running on http://localhost:${PORT}`);
});
