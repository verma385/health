import * as React from 'react';
import Axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/UserContext';


const Message = ({message, read, time, align}) => {
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



    if(align=="left"){
      return (
        <div className="d-flex flex-row justify-content-start mb-4">
              {/* <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                alt="avatar 1" style="width: 45px; height: 100%;"> */}
              <div className="p-3 ms-3" style={{borderRadius: "15px", backgroundColor: "rgba(57, 192, 237,.2)"}}>
                <p className="medium mb-0">{message}</p>
              </div>
              
            </div>
       
      );
    }
    else 

 return (

  <div className="d-flex flex-row justify-content-end mb-4">
  <div className="p-3 me-3 border" style={{borderRadius: "15px", backgroundColor: "#fbfbfb"}}>
    <p className="medium mb-0">{message}</p>
  </div>
  {/* <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;"> */}
</div>

 );
};

export default Message;