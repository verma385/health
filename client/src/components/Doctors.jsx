import * as React from 'react';
import Axios from "axios";
import { useState, useEffect, useContext } from 'react';
import Doctor from '../cards/Doctor';
import Unauthorized from './Unauthorized';
import { UserContext } from './UserContext';
import Specialities from './Specialities';

const Doctors = () => {


    function showDoctor(doctor){
        return <Doctor key={doctor.username} username={doctor.username} name = {doctor.name} email = {doctor.email} speciality={doctor.speciality}
                 clinic={doctor.clinic} city={doctor.city} state={doctor.state}> </Doctor>
    }

    async function filter_submit(event){
        event.preventDefault();
        await Axios({
            method:"POST",
            withCredentials:true,
            url:'/doctors',
              data: {
                  city: city,
                  state:state,
                  speciality:speciality
              },
          }).then((res) => {
            setDoctors([...res.data]);
            console.log(res.data);
          });
    }

    const [doctors, setDoctors] = useState([]);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [speciality, setSpeciality] = useState("");
   
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
      });
    }, []);

  useEffect ( () => {
    Axios({
      method:"POST",
      withCredentials:true,
      url:'/doctors',
        data: {
            city: city,
            state:state,
            speciality:speciality
        },
    }).then((res) => {
      setDoctors([...res.data]);
      
    });
  }, []);
 
  if(!user.username || user.username=="") return <Unauthorized />
  else
 return (
    
   <div>
  <form className="row gy-2 gx-3 align-items-center" onSubmit={filter_submit}>
  <div className="col-auto">
    <div className="form-outline col-12">
      <Specialities setSpeciality={setSpeciality}/>
    </div>
  </div>
  
  <div className="col-auto">
    <div className="form-outline">
      <input type="text" name = "city" className="form-control" id="city" value = {city} onChange={e=>{setCity(e.target.value)}}></input>
      <label className="form-label" htmlFor="city">City</label>
    </div>
  </div>
  <div className="col-auto">
    <div className="form-outline">
        <input type="text" name = "state" className="form-control" id="state" value = {state} onChange={e=>{setState(e.target.value)}}></input>
        <label className="form-label" htmlFor="State">State</label>
  </div>
  </div>
  <div className="col-auto">
    <button type="submit" className="btn btn-primary">Submit</button>
  </div>
</form>


        {
            doctors.map((doctor) => showDoctor(doctor))
        }
   </div>
 );
};

export default Doctors;