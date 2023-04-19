import * as React from 'react';
import Axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

const User = () => {
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

  
  return (

    <div>
      
      <h1>Welcome to HealthBOT</h1>

    </div>
  );
};

export default User;