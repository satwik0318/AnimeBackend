const mongoose=require('mongoose')
require('dotenv').config()
const connectionString=process.env.MONGODB_URI
mongoose.connect(connectionString).then(() => console.log("connected to the database"))
.catch((err) => console.log("Database connection error:", err));