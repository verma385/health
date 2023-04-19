import * as React from 'react';
import Axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import ProfilePhoto from '../components/ProfilePhoto';

const Doctor = ({username, name, email, speciality, clinic, city, state}) => {
  const { user, setUser } = useContext(UserContext);
  const profilePhotoStyle = {
    borderRadius: "100%",
    width: "70px",
    height: "70px",
    // backgroundColor: "#B90136"
  }

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
  
 return (
        <div style={{display : "inline-block", margin:'5px'}} className="card col-md-4  text-center">
  <div className="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
    {/* <img src="https://mdbcdn.b-cdn.net/img/new/standard/nature/111.webp" className="img-fluid"/> */}
    
    <div className="mask" style={{backgroundColor: "rgba(21, 251, 251, 0.15)"}}></div>
   
  </div>
  <div className="card-body">

    <ProfilePhoto username={username} style={profilePhotoStyle}/> 
    <h5 className="card-title"> {name } </h5>
    <p className="card-text"> Speciality : {speciality }</p>
    <p className="card-text"> Clinic : {clinic }</p>
    <p className="card-text"> City: {city }</p>
    <p className="card-text"> State : {state }</p>  
    <Link to={"/user/" + username} target='_blank'> <button className="btn btn-primary"> View Profile </button></Link>

    {/* <Link to={"/chat/" + username}> <button className="btn btn-primary"> Chat </button></Link> */}
  </div>
</div>
  
 );
};

export default Doctor;