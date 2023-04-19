import React,{useState} from "react";
import Axios from "axios";
import {useEffect} from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import ModalRedirect from "./ModalRedirect";
import "./signup.css"
import Specialities from "./Specialities";

function Signup_new(){
    const [name,setName] = useState("");
    const [username,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [confirm_password,setCpassword] = useState("");
    const [message,setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [email, setEmail] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [role, setRole] = useState("user");
    const [speciality, setSpeciality] = useState("");
    const [clinic, setClinic] = useState("");
    const [contact, setContact] = useState("");
    
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [pin, setPin] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(()=>{
        setMessage("");
        setIsVisible(false);
    },[name,username,password,confirm_password]);

    useEffect(()=>{
       if(message=="") setIsVisible(false);
       else setIsVisible(true);
    },[message]);


    function form_submit(event){
       
        event.preventDefault(); //page doesn't refresh after submitting
        if(name == "" || username == "" || password =="" || confirm_password == "" ||
            city == "" || state == ""  || email == "" || aadhar == "" || role == "" || contact=="" ||
            gender =="" || pin=="" || dob==""
        ){
            setMessage("Field is missing");
            setIsVisible(true);
            return;
        }
        if(password != confirm_password){
            setMessage("Password didn't match");
            setIsVisible(true);
            return;
        }
      
        Axios({
            method:"POST",
            withCredentials:true,
            url:'/auth/signup',
            data: { 
                name:name,
                username:username,
                password:password,
                aadhar: aadhar,
                role: role,
                email: email,
                city: city,
                state: state,
                speciality: speciality,
                clinic: clinic,
                contact: contact,
                pin: pin,
                dob: dob,
                gender: gender
            },


        }).then((res)=>{
            setMessage(res.data.message);
            setSuccess(res.data.success)
            setIsVisible(true);
        })



    }

    
     return(
        <div>
        {isVisible && success && <ModalRedirect message={message} isVisible={isVisible} setIsVisible={setIsVisible} redirectLocation={"/login"}/>}

        {isVisible && !success && <Modal message={message} isVisible={isVisible} setIsVisible={setIsVisible}/>}

        <section className="h-100 bg-dark">
        <form onSubmit={form_submit}> 
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col">
              <div className="card card-registration my-4">
                <div className="row g-0">
                  <div className="col-xl-6 d-none d-xl-block">
                    {/* <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                      alt="Sample photo" className="img-fluid"
                      style="border-top-left-radius: .25rem; border-bottom-left-radius: .25rem;" /> */}
                  </div>
                  <div className="col-xl-6">
                    <div className="card-body p-md-5 text-black">
                      <h3 className="mb-5 text-uppercase">Sign Up</h3>
      
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input onChange={e => setName(e.target.value)} value={name} name="name" type="text" id="name" className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="name">Name</label>
                          </div>
                        </div>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input onChange={e=>setUserName(e.target.value)} value={username} name="username" type="text" id="username" className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="username">Username</label>
                          </div>
                        </div>
                      </div>
      
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input type="password" onChange={e=>setPassword(e.target.value)} value={password} name="password" id="password" className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="password">Password</label>
                          </div>
                        </div>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input type="password" onChange={e=>setCpassword(e.target.value)} value={confirm_password} name="confirm_password" id="confirm_password" className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="confirm_password">Confirm Password</label>
                          </div>
                        </div>
                      </div>
      
                      <div className="form-outline mb-4">
                        <input type="text" onChange={e=>setContact(e.target.value)} value={contact} name="contact" id="contact" className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="contact">Contact</label>
                      </div>
      
                      <div className="d-md-flex justify-content-start align-items-center mb-4 py-2">
      
                        <h6 className="mb-0 me-4">Gender: </h6>
      
                        <div className="form-check form-check-inline mb-0 me-4">
                          <input className="form-check-input" type="radio" onChange={e=>setGender(e.target.value)} value="female" name="gender" id="femaleGender"
                             />
                          <label className="form-check-label" htmlFor="femaleGender">Female</label>
                        </div>
      
                        <div className="form-check form-check-inline mb-0 me-4">
                          <input className="form-check-input" type="radio" onChange={e=>setGender(e.target.value)} value="male" name="gender"  id="maleGender"
                            />
                          <label className="form-check-label" htmlFor="maleGender">Male</label>
                        </div>
      
      
                      </div>
      
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input onChange={e=>setCity(e.target.value)} value={city} name="city" type="text" id="city" className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="city">City</label>
                          </div>
                        </div>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input onChange={e=>setState(e.target.value)} value={state} name="state" type="text" id="state" className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="state">State</label>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input type="date" id="dob" onChange={e=>setDob(e.target.value)} value={dob} name="dob"  className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="dob">DOB</label>
                          </div>
                        </div>

                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <input type="text" onChange={e=>setPin(e.target.value)} value={pin} name="pin"  id="pin" className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="pin">PIN Code</label>
                          </div>
                        </div>
                      </div>
                      
                    
                      <div className="form-outline mb-4">
                        <input onChange={e=>setAadhar(e.target.value)} value={aadhar} name="aadhar"type="text" id="aadhar" className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="aadhar">Aadhar</label>
                      </div>
      
                      <div className="form-outline mb-4">
                        <input  type="email" onChange={e=>setEmail(e.target.value)} value={email} name="email" id="email" className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="email">Email ID</label>
                      </div>

                      <div className="d-md-flex justify-content-start align-items-center mb-4 py-2">
      
                        <h6 className="mb-0 me-4">Role: </h6>
      
                        <div className="form-check form-check-inline mb-0 me-4">
                          <input className="form-check-input" type="radio" onChange={e=>setRole(e.target.value)} id="doctor" name="role" value="doctor"
                         />
                          <label className="form-check-label" htmlFor="doctor">Doctor</label>
                        </div>
      
                        <div className="form-check form-check-inline mb-0 me-4">
                          <input className="form-check-input" type="radio" onChange={e=>setRole(e.target.value)} id="user" name="role" value="user"
                         />
                          <label className="form-check-label" htmlFor="user">User</label>
                        </div>
                        </div>

                      {role=="doctor" ? <>

                      <div className="row">
                        {/* <div className="col-md-6 mb-4">
                          <div className="form-outline">
                          
        <select name="speciality"  onChange={e=>setSpeciality(e.target.value)} id="speciality">
        <option value=""> </option>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="opel">Opel</option>
        <option value="audi">Audi</option>
        </select>
        <label htmlFor="speciality">Choose your speciality:</label>
                          </div>
                        </div> */}

                        <Specialities setSpeciality={setSpeciality}/>


                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                          
                <input type="text" onChange={e=>setClinic(e.target.value)} value={clinic} id="clinic" name="clinic"></input>
                <label for="clinic">
                    Clinic Address
                   </label> <br></br> 
                          </div>
                        </div>
                      </div>
        
        </> : "" }
       
      
                      <div className="d-flex justify-content-end pt-3">
                        <button type="reset" className="btn btn-light btn-lg">Reset all</button>
                        <button type="submit" className="btn btn-warning btn-lg ms-2">Sign Up</button>
                      </div>

                        <br></br> <br></br>
                      <div className="d-flex align-items-center justify-content-center pb-4">
                    <p className="mb-0 me-2">Already have an account?</p>
                    <Link to={"/login"}>
                    <button type="button" className="btn btn-outline-danger">Login</button>
                    </Link>   
                  </div>
      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </form>
      </section>
      </div>
     );
}
export default Signup_new;