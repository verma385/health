import * as React from 'react';
import Axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import Unauthorized from './Unauthorized';
import { useParams } from "react-router-dom";
import ProfilePhoto from './ProfilePhoto';

const UserProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const { username } = useParams();

  const [ userProfile, setUserProfile] = useState({});
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

  useEffect(()=>{
    Axios({
      method: "POST",
      withCredentials: true,
      url: '/user-info',
      data: {
        username: username
      },
    }).then((res) => {
      setUserProfile({...res.data[0]});
      
    });
  }, [user]);

  if(!user.username || user.username=="") return <Unauthorized />
  else
  return (

    <div>
      {/* {
        Object.entries(user).map(([key, val]) =>
          <h2 key={key}>{key}: {val}</h2>
        )
      } */}
      
      <ProfilePhoto username={userProfile.username} style={profilePhotoStyle}/>

      <h1> Name : {userProfile.name} </h1>
      <p> Username : { userProfile.username } </p>
      <p> Email : { userProfile.email } </p>
      <p> Aadhar : { userProfile.aadhar } </p>
      <p> City : { userProfile.city } </p>
      <p> State : { userProfile.state } </p>
      <p> Role: {userProfile.role} </p>
      <p> Contact : {userProfile.contact} </p>

      {
        userProfile.role == 'doctor' && <p> Speciality : { userProfile.speciality } </p>
      }
      {
        userProfile.role == 'doctor' && <p> Clinic : { userProfile.clinic } </p>
      }

    </div>
  );
};

export default UserProfile;