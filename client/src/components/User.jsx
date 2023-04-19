import * as React from 'react';
import Axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import Unauthorized from './Unauthorized';
import ProfilePhoto from './ProfilePhoto';
import EditProfilePhoto from './EditProfilePhoto';

const User = () => {
  const { user, setUser } = useContext(UserContext);
  const profilePhotoStyle = {
    borderRadius: "100%",
    width: "200px",
    height: "200px",
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

  if(!user.username || user.username=="") return <Unauthorized />
  else
  return (

    <div>
      {/* {
        Object.entries(user).map(([key, val]) =>
          <h2 key={key}>{key}: {val}</h2>
        )
      } */}
      <ProfilePhoto username={user.username} style={profilePhotoStyle}/>

      <EditProfilePhoto />
      
      <h1> Name : {user.name} </h1>
      <p> Username : { user.username } </p>
      <p> Email : { user.email } </p>
      <p> Aadhar : { user.aadhar } </p>
      <p> City : { user.city } </p>
      <p> State : { user.state } </p>

      {
        user.role == 'doctor' && <p> Speciality : { user.speciality } </p>
      }
      {
        user.role == 'doctor' && <p> Clinic : { user.clinic } </p>
      }

    </div>
  );
};

export default User;