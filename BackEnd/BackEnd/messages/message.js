const verify=require('jsonwebtoken');
const  mongoose=require('mongoose')
const messageSchema=new mongoose.Schema({
   senderId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    reciverId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    text:{type:String },
    image:{type:String},
    seen :{type:Boolean,default:false}
},{timestamps:true})
const message= mongoose.model('Message',messageSchema)
module.exports=message