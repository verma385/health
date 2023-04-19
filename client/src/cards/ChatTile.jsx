import * as React from 'react';
import Axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { UserContext } from '../components/UserContext';
import "./ChatTile.css";
import ProfilePhoto from '../components/ProfilePhoto';

// Props conatin the RECEIVER'S Information
const ChatTile = ({username, unread}) => {
    const [receiver, setReceiver] = useState({});
    const { user, setUser } = useContext(UserContext);
    const profilePhotoStyle = {
      borderRadius: "100%",
      width: "40px",
      height: "40px",
      display:"flex",
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
            method:"POST",
            withCredentials:true,
            url:'/user-info',
              data: {
                  username : username,
              },
          }).then((res) => {
            if(res.data.length > 0) setReceiver(res.data[0]);
            console.log(res.data);
          });
      }, []);

      
  
 return (
   
      <div style={{display : "inline-block", margin:'5px'}} className="card col-lg-8">
  <div className="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
    {/* <img src="https://mdbcdn.b-cdn.net/img/new/standard/nature/111.webp" className="img-fluid"/> */}
    
    <div className="mask" style={{backgroundColor: "rgba(21, 251, 251, 0.15)"}}></div>
   
  </div>
  <div className='container-fluid'>
  <div className='card-body row'>

        
            
            <div class="col-md-4">
            <ProfilePhoto username={receiver.username} style={profilePhotoStyle}/>
            </div>
            <div class="col-md-4">
              <h4> {receiver.name}  </h4>
              </div>
              {/* <p> {receiver.username} </p> */}
            {/* <p > {unread?"New Message":""} </p> */}
            <div class="col-md-4">
        <Link to={"/chats/" + receiver.username}> <button className="btn btn-primary" style={{float:"right"}}> Chat </button></Link>
        </div>
  </div>
  </div>
</div>
  
    
   
 );
};

export default ChatTile;