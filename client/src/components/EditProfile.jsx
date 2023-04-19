import * as React from 'react';
import Axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import Unauthorized from './Unauthorized';
import ModalRedirect from './ModalRedirect';

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  useEffect(()=>{
    Axios({
      method: "POST",
      withCredentials: true,
      url: '/auth/user',
      data: {
        
      },
    }).then((res) => {
      setUser(res.data);
      setName(res.data.name);
    setCity(res.data.city);
    setState(res.data.state);
    setEmail(res.data.email);
    setAadhar(res.data.aadhar);
    setClinic(res.data.clinic);
    setDob(res.data.dob.substring(0,10));
    setPin(res.data.pin);
    setGender(res.data.gender);
    setSpeciality(res.data.speciality);
    setContact(res.data.contact);
    });
  }, []);


  const [name,setName] = useState("");
  const [message,setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [aadhar, setAadhar] = useState("");
  
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
  },[name]);

  useEffect(()=>{
     if(message=="") setIsVisible(false);
     else setIsVisible(true);
  },[message]);



  function form_submit(event){
     
      event.preventDefault(); //page doesn't refresh after submitting
      if(name == "" ||
          city == "" || state == ""  || email == "" || aadhar == "" || contact=="" ||
          gender =="" || pin=="" || dob==""
      ){
          setMessage("Field is missing");
          setIsVisible(true);
          return;
      }
    
      Axios({
          method:"POST",
          withCredentials:true,
          url:'/auth/edit-profile',
          data: { 
                username:user.username,
              name:name,
              aadhar: aadhar,
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
          setSuccess(true);
          setIsVisible(true);
      })



  }




  if(!user.username || user.username=="") return <Unauthorized />
  else
  return (

    <div>
    {isVisible && success && <ModalRedirect message={message} isVisible={isVisible} setIsVisible={setIsVisible} replace = {false} redirectLocation={"/user"}/>}

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
                      <h3 className="mb-5 text-uppercase">Edit Profile</h3>
      
                    
                          <div className="form-outline  mb-4">
                            <input onChange={e => setName(e.target.value)} value={name} name="name" type="text" id="name" className="form-control form-control-lg" />
                            <label className="form-label" htmlFor="name">Name</label>
                          </div>
      
      
                      <div className="form-outline mb-4">
                        <input type="text" onChange={e=>setContact(e.target.value)} value={contact} name="contact" id="contact" className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="contact">Contact</label>
                      </div>
      
                      <div className="d-md-flex justify-content-start align-items-center mb-4 py-2">
      
                        <h6 className="mb-0 me-4">Gender: </h6>
      
                        <div className="form-check form-check-inline mb-0 me-4">
                          <input className="form-check-input" type="radio" checked={gender==="female"?"checked":""} onChange={e=>setGender(e.target.value)} value="female" name="gender" id="femaleGender"
                             />
                          <label className="form-check-label" htmlFor="femaleGender">Female</label>
                        </div>
      
                        <div className="form-check form-check-inline mb-0 me-4">
                          <input className="form-check-input" type="radio" checked={gender==="male"?"checked":""} onChange={e=>setGender(e.target.value)} value="male" name="gender"  id="maleGender"
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
      
                
    

                      {user.role=="doctor" ? <>

                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                          
        <select name="speciality"  onChange={e=>setSpeciality(e.target.value)} id="speciality">
        <option selected={speciality===""?"selected" : ""}value=""> </option>
        <option selected={speciality==="volvo"?"selected" : ""} value="volvo">Volvo</option>
        <option selected={speciality==="saab"?"selected" : ""} value="saab">Saab</option>
        <option selected={speciality==="opel"?"selected" : ""} value="opel">Opel</option>
        <option selected={speciality==="audi"?"selected" : ""} value="audi">Audi</option>
        </select>
        <label htmlFor="speciality">Choose your speciality:</label>
                          </div>
                        </div>

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
                      
                        <button type="submit" className="btn btn-warning btn-lg ms-2">Edit Profile</button>
                      </div>

                        
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
};

export default EditProfile;