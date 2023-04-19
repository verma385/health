var mongoose=require('mongoose');
var passportLocalMongoose=require('passport-local-mongoose');

var userSchema=new mongoose.Schema({
    username: String,
    name: String,
    password: String,
    email: String,
    aadhar: String,
    role: String,
    city: String,
    state: String,
    speciality: String,
    clinic: String,
    dob: Date,
    gender: String,
    pin: String,
    contact : String
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);