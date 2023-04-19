var mongoose=require('mongoose');

var appointmentSchema=new mongoose.Schema({
    doctor: String,
    booked: {}
});

module.exports=mongoose.model("Appointment", appointmentSchema);