var mongoose=require('mongoose');

var userAppointmentSchema=new mongoose.Schema({
    username: String,
    doctor: String,
    time: String,
    date: String,
    exactTime: Date
});

module.exports=mongoose.model("userAppointment", userAppointmentSchema);