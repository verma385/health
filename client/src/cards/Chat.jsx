import * as React from 'react';
import Axios from "axios";
import Message from './Message';
import Unauthorized from '../components/Unauthorized';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/UserContext';
import { useParams } from "react-router-dom";


// Props contain the RECEIVER'S Information
const Chat = () => {
  const { username } = useParams();
  const [receiver, setReceiver] = useState({});
  const [messages, setMessages] = useState([]);
  const [sendMsg, setSendMsg] = useState("");
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
    <div>
        <h2> {receiver.name }</h2>
        <p> Email : {receiver.email }</p>
        <p> Speciality : {receiver.speciality }</p>
        <p> Username : {receiver.username } </p> 
        <p> Clinic : {receiver.clinic}</p>

   </div>
   <div>
    
        {
            messages.map((message) => showMessage(message))
        } 
   </div>

   <div>
    <form onSubmit={submit_form}>
        <input type='text' onChange={(e)=>{setSendMsg(e.target.value)}} value={sendMsg} />
        <button type="submit"> Send </button>

    </form>
   </div>

   </div>
 );
};

export default Chat;