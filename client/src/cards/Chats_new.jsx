import * as React from 'react';
import Axios from "axios";
import Message from './Message';
import Unauthorized from '../components/Unauthorized';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/UserContext';
import { useParams } from "react-router-dom";
import "./chats.css"
import ProfilePhoto from '../components/ProfilePhoto';

// Props contain the RECEIVER'S Information
const Chats_new = () => {
  const { username } = useParams();
  const [receiver, setReceiver] = useState({});
  const [messages, setMessages] = useState([]);
  const [sendMsg, setSendMsg] = useState("");
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
      method: "POST",
      withCredentials: true,
      url: '/user-info',
      data: {
        username:username
      },
    }).then((res) => {
      if(res.data.length > 0) setReceiver(res.data[0]);
    });
  }, []);

  useEffect(()=>{
    Axios({
        method:"POST",
        withCredentials:true,
        url:'/messages',
          data: {
              sender: user.username,
              receiver: username
          },
      }).then((res) => {
        setMessages([...res.data]);
      });
  }, [user, sendMsg]);

    // useEffect( () =>{
    //     const interval = setInterval(()=>{
    //         Axios({
    //             method:"POST",
    //             withCredentials:true,
    //             url:'/messages',
    //             data: {
    //                 sender: user.username,
    //                 receiver: username
    //             },
    //         }).then((res) => {
    //             setMessages([...res.data]);
    //         });
    //      }, 1000);
    //      return () => clearInterval(interval);
    // }, [sendMsg]);

  function showMessage(message){
    var align = "left";
    if(message.sender == user.username){
        align = "right";
    }
    
    return <Message key = {message._id} message = {message.message} time={message.createdAt} read={message.read} align={align} />

  }

  function submit_form(event){
    event.preventDefault();
    if(sendMsg && sendMsg != ""){
        Axios({
            method:"POST",
            withCredentials:true,
            url:'/send-message',
              data: {
                  sender: user.username,
                  receiver: receiver.username,
                  message: sendMsg
              },
          }).then((res) => {
            setSendMsg("");
          });
    }
  }

  if(!user.username || user.username=="") return <Unauthorized />
  else
 return (

   
    <div>

   <section style={{backgroundColor: "#eee"}}>
  <div className="container py-5">

    <div className="row d-flex justify-content-center">
      <div className="col-lg-12 col-lg-12 col-xl-8">

        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center p-3"
            style={{borderTop: "4px solid #39c0ed"}}>
              <div class="col-sm-3">
            <ProfilePhoto username={receiver.username} style={profilePhotoStyle}/>
            </div>

            
            <h5 className="mb-0">{receiver.name}</h5>
            
            <div className="d-flex flex-row align-items-center">
              
              <i className="fas fa-minus me-3 text-muted fa-xs"></i>
              <i className="fas fa-comments me-3 text-muted fa-xs"></i>
              <i className="fas fa-times text-muted fa-xs"></i>
            </div>
          </div>
          <div className="card-body scroll" data-mdb-perfect-scrollbar="true" style={{position: "relative", height: "400px"}}>
          
          {
            messages.map((message) => showMessage(message))
          } 
          
            
          </div>
          <form onSubmit={submit_form}>
          <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
            <div className="input-group mb-0">
           
              <input type="text" className="form-control" onChange={(e)=>{setSendMsg(e.target.value)}} value={sendMsg} placeholder="Type message"
                aria-label="Recipient's username" aria-describedby="button-addon2" />
              <button className="btn"  type="submit" id="button-addon2" style={{paddingTop: ".55rem", color:"white", backgroundColor:"#39c0ed"}}>
                Send
              </button>
             
            </div>
          </div>
          </form>
        </div>

      </div>
    </div>

  </div>
</section>

   </div>




 );
};

export default Chats_new;