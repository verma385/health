// ***** Import modules BEGINS ***** //
const express = require("express");
const app = express();   

const mongoose = require('mongoose')
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const cookieParser = require("cookie-parser");
const cors = require ('cors');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const User = require('./models/user');
const Message = require("./models/message");
const Otp = require("./models/otp");
const Record = require("./models/record");
const Appointment = require("./models/appointment");
const UserAppointment = require("./models/userAppointment");
const ProfilePhoto = require("./models/profilePhoto");

const diseasesInformation = require("./diseasesInformation.json");
const { profile } = require("console");
require('dotenv').config();
// ***** Import modules ENDS ***** //



// ***** Setting up middlewares BEGINS ***** //
const oneHour = 1000 * 60 * 60 ;
app.use(require("express-session")({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    cookie: { maxAge: oneHour },
}));
app.use (cors ());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(cookieParser());
// ***** Setting up middlewares ENDS ***** //



// ***** Database Connectivity BEGINS ***** //
// const mongourl = "mongodb://localhost:27017/healthcare"/
// mongoose.connect(mongourl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     autoIndex: false
// }, (err) => {
//     if(err) console.log(err) 
//     else console.log("mongdb is connected");
// });
// const conn = mongoose.createConnection(mongourl);
// const mongourl = "mongodb://localhost:27017/healthcare"
const mongourl = process.env.DATABASE_URL;

mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false
}, (err, res) => {
    if(err) console.log(err) 
    else {
        console.log("mongdb is connected");
    }
});

// ***** Database Connectivity ENDS ***** //



// ***** Authentication BEGINS ***** //
// SIGNUP //
app.post('/auth/signup',(req,res)=>{
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var aadhar = req.body.aadhar;
    var role = req.body.role;
    var email = req.body.email;
    var city = req.body.city;
    var state = req.body.state;
    var speciality = req.body.speciality;
    var clinic = req.body.clinic;
    var gender = req.body.gender;
    var pin = req.body.pin;
    var dob = req.body.dob;
    var contact = req.body.contact;
    var user=new User({
        name: name, 
        username:username, 
        role:role, 
        email:email, 
        city:city, 
        state:state, 
        aadhar:aadhar,
        speciality:speciality,
        clinic:clinic,
        gender:gender,
        dob:dob,
        pin:pin,
        contact : contact
    });

    User.register(user,password,(err,x)=>{
        if(err) {
            res.send({success : false, message : err.message});
        }
        else {
            res.send({success : true, message : 'User registered successfully!'});
        }
    })
});

// EDIT PROFILE //
app.post('/auth/edit-profile', async (req,res)=>{
    var name = req.body.name;
    var username = req.body.username;
    var aadhar = req.body.aadhar;
    var email = req.body.email;
    var city = req.body.city;
    var state = req.body.state;
    var speciality = req.body.speciality;
    var clinic = req.body.clinic;
    var gender = req.body.gender;
    var pin = req.body.pin;
    var dob = req.body.dob;
    var contact = req.body.contact;
    
    
    const doc = await User.findOneAndUpdate({username : username}, 
        {
        name:name,
        aadhar:aadhar,
        email:email,
        city:city,
        state:state,
        speciality:speciality,
        clinic:clinic,
        gender:gender,
        pin:pin,
        dob:dob,
        contact: contact
        }, {
            new: true,
            upsert: true
    });
    res.send({success : true, message : "Profile updated successfully!!!"});
});

// LOGIN //
// app.post("/login", function (req, res) {
//     if (!req.body.username) {
//         res.send({ success: false, message: "Username was not given" })
//     }
//     else if (!req.body.password) {
//         res.send({ success: false, message: "Password was not given" })
//     }
//     else {
//         passport.authenticate("local", function (err, user, info) {
//             if (err) {
//                 res.send({ success: false, message: err });
//             }
//             else {
//                 if (!user) {
//                     res.send({ success: false, message: "Username or Password incorrect" });
//                 }
//                 else {
//                     res.send({ success: true, message: "Authentication successful",
//                     // username : user.username, 
//                     // name : user.name,
//                     // role : user.role,
//                     // aadhar : user.aadhar,
//                     // email : user.email,
//                     // speciality: user.speciality,
//                     // city: user.city,
//                     // state: user.state
//                     user : user
//                     });
//                 }
//             }
//         })(req, res);
//     }
// });

// LOGIN //
app.post('/auth/login', passport.authenticate('local', { failureRedirect: '/auth/failed' }),  function(req, res) {
    res.send({user: req.user, success:true, message:"Login successful"});
});

// AUTHENTICATION MIDDLEWARE //
function authenticationMiddleware () {
    return function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/notauthorized')
    }
}

// GET LOGGED IN USER //
app.get("/auth/user", function(req, res){
    if(!req.user){
        res.send({});
        return;
    }
    var user = req.user._doc;
    var userRecordAccess = req.session.userRecordAccess;
    if(!userRecordAccess){
        userRecordAccess = {};
    }
    user = {...user, recordAccess : req.session.recordAccess, userRecordAccess : userRecordAccess}
    res.send(user);
});
app.post("/auth/user", function(req, res){
    if(!req.user){
        res.send({});
        return;
    }
    var user = req.user._doc;
    var userRecordAccess = req.session.userRecordAccess;
    if(!userRecordAccess){
        userRecordAccess = {};
    }
    user = {...user, recordAccess : req.session.recordAccess, userRecordAccess : userRecordAccess}
    res.send(user);
});

// LOG OUT EXISTING USER //
app.get('/auth/logout', function(req, res){
    req.logout(function(err) {
      if (err) {
        res.send({success : false, message:"Some error occured. Please try again."});
       }
       else
       res.send({success : true, message:"User logged out successfully."});
    });
});
  
// FAILED LOGIN REDIRECT //
app.get('/auth/failed', function(req, res){
    res.send({user: {}, success:false, message:"Wrong Credentials."})
});

// NOT AUTHORIZED REDIRECT //
app.get("/notauthorized", (req, res)=>{
    res.send("You are not authorized to view this page!!!");
});
// ***** Authentication ENDS ***** //


// ***** OTP Mailing BEGINS ***** //
const MAIL_SETTINGS = {
    service: 'gmail',
    secure: false,
    host: "smpt.gmail.com",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
}
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

// GENERATE OTP //
app.post("/generate-otp", (req, res)=>{
    const toMail = req.body.toMail;
    const username = req.body.username;
    const doctorName = req.body.doctorName;
    if(!username || !toMail) {
        return res.send({success: false, message: "Something went wrong. Please try again."})
    }
    const OTP = otpGenerator.generate(4, {digits:true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets:false});
    try {
        // Add the genereted OTP to the database //
        var html = "";
        if(doctorName){
            html = `
            <div
              class="container"
              style="max-width: 90%; margin: auto; padding-top: 20px"
            >
              <h2>Welcome to the HelathBOT application.</h2>
              <h4>Hope you are doing great!!!</h4>
              <p style="margin-bottom: 30px;">Please share the below OTP with your doctor "${doctorName}"
                to enable them access your
                 <span style="font-size: 15px;"> Medical Records. </span> </p>
              <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${OTP}</h1>
         </div>
          `
        }
        else{
            html =  `
                    <div
                      class="container"
                      style="max-width: 90%; margin: auto; padding-top: 20px"
                    >
                      <h2>Welcome to the HelathBOT application.</h2>
                      <h4>Hope you are doing great!!!</h4>
                      <p style="margin-bottom: 30px;">Please enter the below OTP to access your
                         <span style="font-size: 15px;"> Medical Records. </span> </p>
                      <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${OTP}</h1>
                 </div>
                  `
        }
        Otp.updateOne({"username" : username}, 
            {otp: OTP, "username" : username}, 
            {upsert:true}, 
            function(error, result){
                let info = transporter.sendMail({
                    from: MAIL_SETTINGS.auth.user,
                    to: toMail, 
                    subject: 'OTP From HealthBOT',
                    html: html,
                  });
                  res.send({success: true, message: `An email with the OTP has been sent to the registered mail id ${toMail} of the user ${username}`});
            });
      } catch (error) {
        console.log(error);
        res.send({success: false, message: "Something went wrong. Please try again."});
      }
  });

// VERIFY OTP //
app.post("/verify-otp", (req, res)=>{
    const EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes == 600000 milliseconds
    const otpEntered = req.body.otpEntered;
    const username = req.body.username;
    Otp.findOne({"username" : username, otp:otpEntered}, function(error, result){
        if(error || !result) return res.send({ success: false, message: "Invalid OTP. Please try again."});  
        const currentTime = Date.now();
        const updatedAt = result.updatedAt;
        const duration = currentTime - updatedAt;
        if(duration>EXPIRY_DURATION){
            res.send({ success: false, message: "Invalid OTP. Please try again."}); 
        }
        Otp.findOneAndDelete({"username" : username, otp:otpEntered}, function(err, result){
            if(err) console.log(err);
            req.session.recordAccess = true;
            res.send({ success: true, message: "OTP verified successfully."});
        })
        
    });
})


// VERIFY OTP for doctors to access the records of patients //
app.post("/doctors/verify-otp", (req, res)=>{
    const EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes == 600000 milliseconds
    const otpEntered = req.body.otpEntered;
    const username = req.body.username;
    const doctor = req.body.doctor;

    if(!otpEntered || !username || !doctor){
        res.send({ success: false, message: "Some error occurred. Please try again."}); 
    }
    Otp.findOne({"username" : username, otp:otpEntered}, function(error, result){
        if(error || !result) return res.send({ success: false, message: "Invalid OTP. Please try again."});  
        const currentTime = Date.now();
        const updatedAt = result.updatedAt;
        const duration = currentTime - updatedAt;
        if(duration>EXPIRY_DURATION){
            res.send({ success: false, message: "Invalid OTP. Please try again."}); 
        }
        Otp.findOneAndDelete({"username" : username, otp:otpEntered}, function(err, result){
            if(err) console.log(err);
            
            req.session.userRecordAccess = {...{[username] : true}};
            res.send({ success: true, message: "OTP verified successfully."});
        })
        
    });
})
// ***** OTP Mailing ENDS ***** //



// ***** Records Section BEGINS ***** //
// Set up Multer middleware to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

// UPLOAD A RECORD //
app.post("/records/upload", upload.single("file"), async (req, res) => {
  const { originalname, buffer, mimetype } = req.file;

  const record = new Record({
    name: originalname,
    data: buffer,
    contentType: mimetype,
    desc: req.body.desc,
    username: req.body.username
  });
  await record.save();
  res.send("Document uploaded successfully");
});

// RETRIEVE A DOCUMENT //
app.post("/records/:id", async (req, res) => {
  const record = await Record.findById(req.params.id);
//   res.set({
//     "Content-Type": record.contentType,
//     "Content-Disposition": `inline; filename=${record.name}`,
//   });
//   res.send(record.data);
 if(!record) return res.send({});

const base64 = Buffer.from(record.data).toString("base64");
  const data = {
    filename: record.name,
    contentType: record.contentType,
    base64: base64,
    desc:record.desc
  };
  res.send(data);

});

app.post("/record-info", async function(req, res){
    const record = await Record.findById(req.body._id);
    res.send(record);
})

app.post("/records", async function(req, res){
    const username = req.body.username;
    const records = await Record.find({username:username})
                                .select( {_id:1});
    res.send(records);
});


// DELETE A DOCUMENT //
app.post("/records/delete/:id", async (req, res) => {
    Record.deleteOne({ _id : req.params.id }).then(function(){
        res.send({success : true, message:"Record deleted successfully!!!"});
    }).catch(function(error){
        console.log(error); 
        res.send({success : false, message:"Some error occurred. Please try again later!!!"});
    });
});
  

// ***** Records Section ENDS ***** //



// ***** Profile Photo Section BEGINS ***** //


function base64_encode(file) {
    return fs.readFileSync(file, 'base64');
}
  
// UPLOAD A PROFILE PHOTO //
app.post("/profile-photo/upload", upload.single("photo"), async (req, res) => {
    const { originalname, buffer, mimetype } = req.file;
   
    const doc = await ProfilePhoto.findOneAndUpdate({username:req.body.username}, 
        {   name: originalname,
            data: buffer,
            contentType: mimetype,
            username: req.body.username}, 
        {
            new: true,
            upsert: true
    });
    res.send({success:true, message: "Profile Photo Updated Successfully!!! Refresh the page to see changes."});
  });
  

// RETRIEVE A PROFILE PHOTO //
app.post("/profile-photo/:username", async (req, res) => {
    ProfilePhoto.
        find({username : req.params.username}).
        // select({}).
        exec(function(err, photos){
            if(err) console.log(err);
           
            if(photos.length==0){
                var base64str = base64_encode('./default-profile-photo.jpg');
                const data = {
                    filename: "default-profile-photo",
                    contentType: "image/jpg",
                    base64: base64str
                };
                return res.send(data);
            }

            const photo = photos[0];
            const base64 = Buffer.from(photo.data).toString("base64");
            const data = {
                filename: photo.name,
                contentType: photo.contentType,
                base64: base64
            };
            res.send(data);
        });
  });

// ***** Profile Photo Section ENDS ***** //



// ***** General BEGINS ***** //
// GET THE LIST OF DOCTORS AVAILABLE //
app.post("/doctors", /*authenticationMiddleware(),*/ (req, res)=>{
    var city = req.body.city;
    var state = req.body.state;
    var speciality = req.body.speciality;
    var filter = {
        role: 'doctor',
    };
    if(city != '' && city){
        filter = {...filter, city:{ $regex : new RegExp(city, "i")}};
    }
    if(state != '' && state){
        filter = {...filter, state:{ $regex : new RegExp(state, "i")}};
    }
    if(speciality != '' && speciality){
        filter = {...filter, speciality:{ $regex : new RegExp(speciality, "i")}};
    }
   
    User.
        find(filter).
        // limit(10).
        sort({ }).
        select({ username:1, name: 1, email: 1, speciality:1, clinic:1, city:1, state:1 }).
        exec(function(err, doctors){
            if(err) console.log(err);
            res.send(doctors);
        });
});

// GET THE MESSAGES OF A USER WITH A PARTICULAR PERSON //
app.post("/messages", /*authenticationMiddleware(),*/ function(req, res){
    var sender = req.body.sender;
    var receiver = req.body.receiver;
    var filter = { $or: [ { sender: sender, receiver:receiver }, { sender:receiver, receiver:sender } ] };
    
    Message.updateMany({receiver : sender}, {read:true}, function(error, result){
        if(error) res.send(error) 
        Message.
            find(filter).
            limit().
            sort({ createdAt : 1}).
            select({}).
            exec(function(err, messages){
                if(err) console.log(err);
                res.send(messages);
            });
    });
});

// GET A PARTICULAR USER'S INFORMATION //
app.post("/user-info", /*authenticationMiddleware(),*/ (req, res)=>{
    var username = req.body.username;
    User.
        find({username : username}).
        // select({ username: 1, name: 1, email: 1, speciality:1, clinic:1, city:1, state:1 }).
        exec(function(err, user){
            if(err) console.log(err);
            res.send(user);
        });
});


// GET THE LIST OF PERSONS WITH WHOM A USER HAS DONE CHATTING //
app.post("/chats", /*authenticationMiddleware(),*/(req, res)=>{
    var username = req.body.username;
    var filter = { $or: [ { sender: username }, { receiver:username } ] };
    var result = {};
    var msg = {};
    Message.
        find(filter).
        sort({ createdAt : 1}).
        select({}).
        exec(function(err, messages){
            if(err) console.log(err);
            messages.map((message)=>{
                if(message.sender != username){
                    var flag = false;
                    if(message.read==false){
                        flag = true;
                    }
                    result = {...result, [message.sender] : {"createdAt" : message.createdAt}}
                    if(flag){
                        msg = {...msg, [message.sender] : 1 }
                    }
                }
                else if(message.receiver != username){
                    // var flag = false;
                    // if(message.read==false){
                    //     flag = true;
                    // }
                    result = {...result, [message.receiver] : {"createdAt" : message.createdAt}}
                    // if(flag){
                    //    msg = {...msg, [message.receiver] : 1}
                    // }
                }
            })
            var ret = [];
            
            for (const [key, value] of Object.entries(result)) {
                var flag = false;
                if(msg[key]==1){
                    flag = true;
                }
                ret.push({key: key, createdAt: value.createdAt, unread: flag});
            }
            ret.sort((a, b) => { return (b.createdAt-a.createdAt)});
            res.send(ret);
        });
});

// SEND A MESSAGE TO A PARTICULAR PERSON //
app.post("/send-message", /*authenticationMiddleware(),*/ (req, res)=>{
    var sender = req.body.sender;
    var receiver = req.body.receiver;
    var message = req.body.message;
    var insertMsg = {sender:sender, receiver:receiver, message:message};
    Message.insertMany([insertMsg], (err, result)=>{
        if(err) res.send(err);
        res.send(result);
    });
});

// TEMP //
app.get("/", (req, res)=>{
    res.send("hi " + req.user);
});

app.get("/o", (req, res)=>{
    Otp.insertMany([{"otp" : "1234", "username" :'a'}], (err, result)=>{
        if(err) res.send(err);
        res.send(result);
    })
})
// ***** General ENDS ***** //




// ***** Disease Predictin BEGINS ***** //
// var flask_uri = "http://127.0.0.1:8080" 
var flask_uri = process.env.FLASK_URI;

app.post("/prediction", (req, res)=>{
    var symptoms = req.body.symptoms;
    symptoms_formatted = [];
    symptoms.map(symptom => {
        var symptom_formatted = symptom.replaceAll(" ", "_");
        symptom_formatted = symptom_formatted.toLowerCase();
        symptoms_formatted.push(symptom_formatted);
    });

    // Node to Flask request
    var data = {
        "symptoms" : symptoms_formatted
    }
  
    axios.post(flask_uri + "/flask/prediction", data)
        .then(response => {
            var result = response.data.result;
            var new_result = []
            result.map((re)=>{
                var tem = re;
                var disease_trimmed = re.disease.trim();
                
                tem.info = diseasesInformation[disease_trimmed]["info"];
                tem.symptoms = diseasesInformation[disease_trimmed]["symptoms"];
                tem.link =  diseasesInformation[disease_trimmed]["link"];
                new_result.push(tem);
            });
          res.send({ success : true, diseases: new_result});
          
        })
        .catch(error => {
          res.send({success : false, message : "Some error occurred"})
          console.error(error);
        });
    

})

// ***** Disease Predictin ENDS ***** //

var appts = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
             "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
             "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
            ];


function formatDate(date){
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).replace(/ /g, '-');
    return formattedDate;
}

app.post("/doctors/appointments", async (req, res)=>{
    var doctor = req.body.doctor;
        User.find({ username:doctor }, function (error, users) {
        if(error) {
            console.log(error);
            return res.send({});
        }
        
        else if(users.length==0 || (users.length>0 && users[0].role != 'doctor')) {
            return res.send({});
        }
        
      else{
        Appointment.
        find({doctor: doctor}).
        // select({ doctor: 1, booked: 1}).
        exec(async function(err, appointment){
            if(err) console.log(err);
            var today = new Date();
            var formattedDate = formatDate(today);
            var result = {};
            var booked = {}
            if(appointment[0])
                booked = appointment[0].booked;
          
            if(!booked) booked = {}
            var current = today;
            for(var i=0;i<7;i++){
                if(i != 0) current.setHours(current.getHours()+24);
                var currentFormatted = formatDate(current);
                result[currentFormatted] = {}
                if(!(currentFormatted in booked)){
                    booked[currentFormatted] = {}
                }

                for(var j=0;j<appts.length;j++){
                    var time = appts[j];
                    var currentTime =  new Date();
                    const mp = {"Jan" : 0, "Feb" : 1, "Mar" : 2, "Apr" : 3, "May" : 4, "Jun" : 5, "Jul" : 6,
                        "Aug" : 7, "Sep" : 8, "Oct" : 9, "Nov" : 10, "Dec" : 11};
                    var hrs = parseInt(time.substring(0,2));
                    if(time.substring(6,8)=="PM") hrs += 12;
                    
                    var mins = parseInt(time.substring(3,5));
        
                    var slotTime = new Date(currentFormatted.substring(7,11), mp[currentFormatted.substring(3,6)],currentFormatted.substring(0,2),
                                                hrs, mins);
                     
        
             

                    if(!(appts[j] in booked[currentFormatted]) && slotTime>currentTime){
                       result[currentFormatted][appts[j]] = 1;
                       booked[currentFormatted][appts[j]]=""
                    }
                    else if(booked[currentFormatted][appts[j]]=="" && slotTime>currentTime){
                        result[currentFormatted][appts[j]] = 1;
                    }
                }
            }
            return res.send(result);
        });
      }
        });
});

app.post("/doctors/book-appointment", async (req, res)=>{
    var doctor = req.body.doctor;
    var username = req.body.username;
    var date = req.body.date;
    var time = req.body.time;
    
    if(!doctor || !username || !date || !time){
        return res.send({success : false , message: "Some error occurred!!!"});
    }
    else {
        User.find({ username:doctor }, function (error, users) {
            if(error) {
                console.log(error);
                return res.send({});
            }
            
            else if(users.length==0 || (users.length>0 && users[0].role != 'doctor')) {
                return res.send({success : false , message: "Some error occurred!!!"});
            }
            
          });
    }
    
   
    Appointment.
        find({doctor: doctor}).
        // select({ doctor: 1, booked: 1}).
        exec(async function(err, appointment){
            if(err) console.log(err);
            var booked = {};
            if(appointment[0])
                booked = appointment[0].booked;
            if(appointment.length==0){
                const app = new Appointment({
                    doctor : doctor,
                    booked : {}
                  });
                  await app.save();
            }
           
            if(!booked) booked = {}
          
            if(!(date in booked)){
                booked[date] = {}
            }

            if(!(time in booked[date])){
                booked[date][time] = username;
            }
            
            const doc = await Appointment.findOneAndUpdate({doctor:doctor}, {booked:booked}, {
                new: true,
                upsert: true
            });
            
            const mp = {"Jan" : 0, "Feb" : 1, "Mar" : 2, "Apr" : 3, "May" : 4, "Jun" : 5, "Jul" : 6,
                "Aug" : 7, "Sep" : 8, "Oct" : 9, "Nov" : 10, "Dec" : 11};
            var hrs = parseInt(time.substring(0,2));
            if(time.substring(6,8)=="PM") hrs += 12;
            
            var mins = parseInt(time.substring(3,5));

            var exactTime = new Date(date.substring(7,11), mp[date.substring(3,6)],date.substring(0,2),
                                        hrs, mins);
            

            var insertAppt = {doctor:doctor, username:username, date:date, time:time, exactTime:exactTime};
            
            UserAppointment.insertMany([insertAppt], (err, result)=>{
                if(err) return res.send({success : false , message: "Some error occurred!!!"});
                return res.send({success : true , message: "Appointment booked successfully!!!"});
             });
    });
});

// For doctors
app.post("/doctors/my-appointments", async (req, res)=>{
    var username = req.body.username;
    UserAppointment.
        find({ doctor: username }).
        // select({ username: 1, name: 1, email: 1, speciality:1, clinic:1, city:1, state:1 }).
        exec(function (err, appts) {
            if (err)
                console.log(err);
            res.send(appts)
        });
});

app.post("/exists-appointment", async (req, res)=>{
    var username = req.body.username;
    var doctor = req.body.doctor;
    var time = req.body.time;
    var date = req.body.date;
   
    UserAppointment.
        find({ doctor: doctor, username : username, date : date, time: time}).
        // select({ username: 1, name: 1, email: 1, speciality:1, clinic:1, city:1, state:1 }).
        exec(function (err, appts) {
            if (err)
                console.log(err);
            if(appts && appts.length>0){
                res.send({exist : true, message:""});   
            }
            else{
                res.send({exist:false, message : "No such appointment exists."});
            }
        });
});

app.post("/users/cancel-appointment", async (req, res)=>{
    var username = req.user.username;
    var doctor = req.body.doctor;
    var time = req.body.time;
    var date = req.body.date;
    
    UserAppointment.deleteOne({ doctor: doctor, username : username, date : date, time: time},
        function(err){
            if(err){
                res.send({ success : false, message : "Some error occurred"});
            }
            else{
                Appointment.
                    find({doctor: doctor}).
                    // select({ doctor: 1, booked: 1}).
                    exec(async function(err, appointment){
                        if(err) console.log(err);
           
                        var booked = {};
                        if(appointment[0])
                             booked = appointment[0].booked;
                       
                        if(!booked) booked = {}
          
                        if(!(date in booked)){
                            booked[date] = {}
                        }

                        booked[date][time] = "";
                        
            
                        const doc = await Appointment.findOneAndUpdate({doctor:doctor}, {booked:booked}, {
                            new: true,
                            upsert: true
                        });
            
                        res.send({success : true, message : "Appointment cancelled successfully"})
           
             });
               
            }
        })
        
});

// async function getUser(username){
//     User.find({ username:username }, function (error, users) {
//         if(error) console.log(error);
//         console.log(users[0]);
//         if(users) return users[0];
        
//       });
// }

// // For doctors
// app.get("/doctors/my-appointments", async (req, res)=>{
//     var username = req.body.username || "abc";
//     var result = [];
//     UserAppointment.
//         find({ doctor: username }).
//         // select({ username: 1, name: 1, email: 1, speciality:1, clinic:1, city:1, state:1 }).
//         exec(async function (err, appts) {
//             if (err)
//                 console.log(err);
            
//             result = await Promise.all(appts.map(async appt => await getUser(appt.username)));
            
//         });
//         res.send(result);
// });

app.post("/users/my-appointments", (req, res)=>{
    var username = req.body.username;
    UserAppointment.
        find({ username: username }).
        // select({ username: 1, name: 1, email: 1, speciality:1, clinic:1, city:1, state:1 }).
        exec(function (err, appts) {
            if (err)
                console.log(err);
            res.send(appts)
        });
})



// ***** Doctor Recommendation BEGINS ***** //
app.post("/doctors-for-disease", (req, res)=>{
    const disease = req.body.disease.trim();
    var result = [];
    var specialities = diseasesInformation[disease]["recomm"];
    User.
        find({speciality: { $in: specialities }}).
        // limit(10).
        sort({ }).
        select({ username:1, name: 1, email: 1, speciality:1, clinic:1, city:1, state:1 }).
        exec(function(err, doctors){
            if(err) console.log(err);
            res.send(doctors);
        });
})

// ***** Doctor Recommendation ENDS ***** //




// **************************************** //
// *************TEMPORARY****************** //
const users = require("./sample/users.json");
app.get("/initialise-users", async (req, res)=>{
    const password = "123";
    users.users.map((user)=>{
        var curUser=new User(user);
        User.register(curUser,password,(err,x)=>{
            if(err) {
            //    console.log(err);
            }
            else {
               
            }
        });
    });
    return res.send({message : "Users regisetered successfully!!!"});
});

app.get("/intialise-photo", async (req, res)=>{
    users.photos.map(async (photo)=>{
        // var base64str = fs.readFileSync('./sample/photos/' + photo.image).toString("base64");
        // // var base64str = Buffer.from('./sample/photos/' + photo.image).toString("base64")
        // const doc = await ProfilePhoto.findOneAndUpdate({username:photo.username}, 
        //     {   name: photo.image,
        //         data: base64str,
        //         contentType: photo.type,
        //         username: photo.username}, 
        //     {
        //         new: true,
        //         upsert: true
        // });
        var obj = new ProfilePhoto({
            name: photo.name,
            username:photo.username,
            data: fs.readFileSync(path.join(__dirname + '/sample/photos/' + photo.image)),
            contentType: photo.type
        });
        await obj.save();

    });
    return res.send({message : "Profile photos updated successfully!!!"});
});

// **************************************** //
// **************************************** //

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"));
    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

// ***** Setting up Port BEGINS ***** //
const port = process.env.PORT;
app.listen(port,(err)=>{
    if(err) console.log('error');
    else console.log('connected at 5000');
});
// ***** Setting up Port ENDS ***** //



