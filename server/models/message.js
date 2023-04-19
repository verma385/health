var mongoose=require('mongoose');

var messageSchema=new mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
    read: {
        type : Boolean,
        default : false
    }
}, { timestamps: true });

module.exports=mongoose.model("Message",messageSchema);