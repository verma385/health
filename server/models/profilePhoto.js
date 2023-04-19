const mongoose=require('mongoose');
const profilePhotoSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String,
    username: String,
}, {timestamps: true});
  
module.exports=mongoose.model("ProfilePhoto", profilePhotoSchema);
