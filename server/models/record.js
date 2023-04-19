const mongoose=require('mongoose');
const recordSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String,
    username: String,
    desc: String
}, {timestamps: true});
  
module.exports=mongoose.model("Record", recordSchema);
