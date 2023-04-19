var mongoose=require('mongoose');

const otpSchema = new mongoose.Schema(
    { 
        otp: String,
        username: String,
    }, 
    { timestamps: true }
);

module.exports=mongoose.model("Otp", otpSchema);