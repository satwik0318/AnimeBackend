const express = require('express');
const cors = require('cors');
require('./db/connect');
const http = require('http');
const cookieParser = require('cookie-parser');
const commentRoutes = require('./Comments/comment'); 
const authRouter = require('./Login/authRoutes');
const userRouter = require('./Login/userRouter');
const { messageRouter } = require('./messages/MessageRoutes');
const { anime } = require('./Anime/animeRoute');
const { Server } = require('socket.io');
const { initializeSocket } = require('./Socket/SocketChat');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Trusted frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://animeppl.onrender.com',
  'https://anime4u-q9xl.onrender.com'
];

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }
});

// store online users
initializeSocket(io);

// ✅ Express CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/', commentRoutes);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/anime", anime);

app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
