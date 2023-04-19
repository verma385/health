// ***** Import modules BEGINS ***** //
const express = require("express");
const app = express();   

const mongoose = require('mongoose')
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const cors = require ('cors');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const multer = require("multer");

const User = require('./models/user');
const Message = require("./models/message");
const Otp = require("./models/otp");
const Record = require("./models/record");
// ***** Import modules ENDS ***** //



// ***** Setting up middlewares BEGINS ***** //
app.use(require("express-session")({
    secret : "abdefghijkmnopqrstuvwxyz",
    resave : false,
    saveUninitialized : false
}));
app.use (cors ());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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
const mongourl = "mongodb://localhost:27017/healthcare"

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
    var user=new User({
        name: name, 
        username:username, 
        role:role, 
        email:email, 
        city:city, 
        state:state, 
        aadhar:aadhar,
        speciality:speciality,
        clinic:clinic
    });

    User.register(user,password,(err,x)=>{
        if(err) {
            res.send(err.message);
        }
        else {
            res.send('User registered successfully!');
        }
    })
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
    res.send(req.user);
})

// LOG OUT EXISTING USER //
app.get('/auth/logout', function(req, res){
    req.logout(function(err) {
      if (err) { return err; }
      res.send('Logout Success');
    });
});
  
// FAILED LOGIN REDIRECT //
app.get('/auth/failed', function(req, res){
    res.send({user: {}, success:false, message:"Wrong Credentials"})
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
      user: 'healthbot.application@gmail.com',
      pass: 'ufhezoojxemdoyxx',
    },
}
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

// GENERATE OTP //
app.post("/generate-otp", (req, res)=>{
    const toMail = req.body.toMail;
    const username = req.body.username;
    if(!username || !toMail) {
        return res.send({success: false, message: "Something went wrong. Please try again."})
    }
    const OTP = otpGenerator.generate(4, {digits:true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets:false});
    try {
        // Add the genereted OTP to the database //
        Otp.updateOne({"username" : username}, 
            {otp: OTP, "username" : username}, 
            {upsert:true}, 
            function(error, result){
                let info = transporter.sendMail({
                    from: MAIL_SETTINGS.auth.user,
                    to: toMail, 
                    subject: 'OTP From HealthBOT',
                    html: `
                    <div
                      class="container"
                      style="max-width: 90%; margin: auto; padding-top: 20px"
                    >
                      <h2>Welcome to the HelathBOT application.</h2>
                      <h4>Hope you are doing great!!!</h4>
                      <p style="margin-bottom: 30px;">Please enter the below OTP to proceed.</p>
                      <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${OTP}</h1>
                 </div>
                  `,
                  });
                  res.send({success: true, message: "An email with the OTP has been sent to the registered mail id."});
            });
      } catch (error) {
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
    res.send({_id: record._id, name: record.name, desc: record.desc, createdAt: record.createdAt, updatedAt: record.updatedAt});
})

app.post("/records", async function(req, res){
    const username = req.body.username;
    Record.find({username:username}, {_id:1}, function(err, records){
        if(err) console.log(err);
        res.send(records);
    })
})


// ***** Records Section ENDS ***** //



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
    console.log(filter);
    User.
        find(filter).
        limit(10).
        sort({ }).
        select({ name: 1, email: 1, speciality:1, clinic:1, city:1, state:1 }).
        exec(function(err, doctors){
            if(err) console.log(err);
            console.log(doctors);
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
                console.log(messages);
                res.send(messages);
            });
    });
});

// GET A PARTICULAR USER'S INFORMATION //
app.post("/user-info", /*authenticationMiddleware(),*/ (req, res)=>{
    var username = req.body.username;
    User.
        find({username : username}).
        select({ username: 1, name: 1, email: 1, speciality:1, clinic:1, city:1, state:1 }).
        exec(function(err, user){
            if(err) console.log(err);
            console.log(user);
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
                    var flag = false;
                    if(message.read==false){
                        flag = true;
                    }
                    result = {...result, [message.receiver] : {"createdAt" : message.createdAt}}
                    if(flag){
                       msg = {...msg, [message.receiver] : 1}
                    }
                }
            })
            var ret = [];
            console.log(result);
            console.log(msg);
            for (const [key, value] of Object.entries(result)) {
                var flag = false;
                if(msg[key]==1){
                    flag = true;
                }
                ret.push({key: key, createdAt: value.createdAt, unread: flag});
            }
            ret.sort((a, b) => { return (b.createdAt-a.createdAt)})
            console.log(ret);
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



// ***** Setting up Port BEGINS ***** //
app.listen(5000,(err)=>{
    if(err) console.log('error');
    else console.log('connected at 5000');
});
// ***** Setting up Port ENDS ***** //



