import * as React from 'react';
import {useState, useEffect, useContext} from "react";
import Axios from "axios";
import { UserContext } from './UserContext';
import Unauthorized from './Unauthorized';
import ModalRedirect from './ModalRedirect';

const EditProfilePhoto = () => {
    const [photo, setPhoto] = useState('');
    const [msg, setMsg] = useState("");
    const [isVisible, setIsVisible] = useState(false);
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

    
 
    function form_submit(event){
        event.preventDefault();
        if(!photo){
            setMsg("Please select a photo to update the profile picture.");
            return;
        }

        const formData = new FormData();
        formData.append('photo', photo);
        formData.append("username", user.username);
        
        Axios({
            method:"POST",
            withCredentials:true,
            url:'/profile-photo/upload',
            data: formData,
        }).then((res)=>{
            setMsg(res.data.message);
            setIsVisible(true);
        });
    }
    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
      }
      if(!user.username || user.username=="") return <Unauthorized />
      else
  return (
   <div>
           {isVisible && <ModalRedirect message={msg} isVisible={isVisible} setIsVisible={setIsVisible} redirectLocation="/user" />}


            
            <form onSubmit={form_submit}>
            <input type="file" onChange={ handlePhotoChange } name="photo"></input>
            <button type='submit'> Update Profile Photo </button>
        </form>   
            
   </div>
 );
};

export default EditProfilePhoto;