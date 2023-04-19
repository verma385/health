import { useParams, useLocation } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { UserContext } from './UserContext';
import Unauthorized from './Unauthorized';
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Doctor from "../cards/Doctor";

function DoctorForDisease() {
  const { user, setUser } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);

    const disease =  searchParams.get("disease").trim();
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [changed, setChanged] = useState(false);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    

  useEffect(()=>{
    Axios({
      method: "POST",
      withCredentials: true,
      url: '/auth/user',
      data: {
        
      },
    }).then((res) => {
      setUser(res.data);
    });
  }, []);

  useEffect(()=>{
    Axios({
      method: "POST",
      withCredentials: true,
      url: '/doctors-for-disease',
      data: {
        disease : disease
      },
    }).then((res) => {
      setDoctors(res.data);
      setFilteredDoctors(res.data);
      console.log(res.data);
    });
  }, []);

  
function handleCityChange(event){
    event.preventDefault();
    setCity(event.target.value);
    setChanged(!changed);
}

function handleStateChange(event){
    event.preventDefault();
    setState(event.target.value);
    setChanged(!changed);
}

useEffect(()=>{
    if(city==="" && state===""){
        setFilteredDoctors(doctors);
        return;
    }
    if(!city && !state){
        setFilteredDoctors(doctors);
    }
    var new_result = [];
    
    doctors.map((doctor)=>{

        if(!city || city===""){
            var regexState = new RegExp(state, "i");
            var resultState = doctor.state.match(regexState);

            if(resultState){
                new_result.push(doctor);
            }
        }

        else if(!state || state===""){
            var regexCity = new RegExp(city, "i");
            var resultCity = doctor.city.match(regexCity);

            if(resultCity){
                new_result.push(doctor);
            }
        }
        else{
            var regexCity = new RegExp(city, "i");
            var regexState = new RegExp(state, "i");
            var resultCity = doctor.city.match(regexCity);
            var resultState = doctor.state.match(regexState);

            if(resultCity || resultState){
                new_result.push(doctor);
            }
        }

        
    });
    
    setFilteredDoctors(new_result);
   
}, [changed]);

function showDoctor(doctor){
    return <Doctor key={doctor.username} username={doctor.username} name = {doctor.name} email = {doctor.email} speciality={doctor.speciality}
             clinic={doctor.clinic} city={doctor.city} state={doctor.state}> </Doctor>
}
  

  
  
  if(!user.username || user.username=="") return <Unauthorized />   
 
  else
  return (

    <div>
         <form className="row gy-2 gx-3 align-items-center" >
  
  <div className="col-auto">
    <div className="form-outline">
      <input type="text" name = "city" className="form-control" id="city" value = {city} onChange={handleCityChange}></input>
      <label className="form-label" htmlFor="city">City</label>
    </div>
  </div>
  <div className="col-auto">
    <div className="form-outline">
        <input type="text" name = "state" className="form-control" id="state" value = {state} onChange={handleStateChange}></input>
        <label className="form-label" htmlFor="State">State</label>
  </div>
  </div>
  
</form>

<div>
    <br></br>
    {
        filteredDoctors.map((doctor) => showDoctor(doctor))
    }
</div>
      
    </div>
  );
}

export default DoctorForDisease;