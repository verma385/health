import * as React from 'react';
import Axios from "axios";
import Chat from '../cards/Chat';
import ChatTile from '../cards/ChatTile';
import Unauthorized from './Unauthorized';
import { UserContext } from './UserContext';
import { useState, useEffect, useContext } from 'react';


const Chats = () => {
  const [chats, setChats] = useState([]);
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

  useEffect(() => {
    Axios({
      method: "POST",
      withCredentials: true,
      url: '/chats',
      data: {
        username: user.username,
      },
    }).then((res) => {
      setChats(res.data);
    });
  }, [user]);

  if(!user.username || user.username=="") return <Unauthorized />
  else
  return (
    <div>
      {
        chats.map((chat) => {
          return <ChatTile key={chat.key} username={chat.key} unread={chat.unread} />
        })
        
      }

    </div>
  );
}

export default Chats;