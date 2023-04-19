import * as React from 'react';
import {useState, useEffect, useContext} from "react";
import Axios from "axios";
import { UserContext } from './UserContext';
import Unauthorized from './Unauthorized';

const File = () => {
    const [file, setFile] = useState('');
    const [desc, setDesc] = useState('');
    const [msg, setMsg] = useState("");
    const { user, setUser } = useContext(UserContext);

    const [otpEntered, setOtpEntered] = useState("");
    const [otpSent, setOtpSent] = useState(false);
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
        setMsg("");
    },[file, desc, otpEntered]);

    function generate_OTP(event){
      event.preventDefault();
      Axios({
          method: "POST",
          withCredentials: true,
          url: '/generate-otp',
          data: {
            username: user.username,
            toMail : user.email
          },
        }).then((res) => {
          setMsg(res.data.message);
          setOtpSent(res.data.success);
        });
    }
  
    function verify_OTP(event){
      event.preventDefault();
      Axios({
          method: "POST",
          withCredentials: true,
          url: '/verify-otp',
          data: {
            username: user.username,
            otpEntered: otpEntered
          },
        }).then((res) => {
           setMsg(res.data.message);
           Axios({
            method: "POST",
            withCredentials: true,
            url: '/auth/user',
            data: {
              
            },
          }).then((res) => {
            setUser(res.data);
          });
        });
      }
 
    function form_submit(event){
        event.preventDefault();
        if(!file || !desc){
            setMsg("Field is empty");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append("username", user.username);
        formData.append("desc", desc);

        Axios({
            method:"POST",
            withCredentials:true,
            url:'/records/upload',
            data: formData,
        }).then((res)=>{
            setMsg(res.data);
        });
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
      }
      if(!user.username || user.username=="") return <Unauthorized />
      else
  return (
   <div>
        <p> {msg} </p>

        
            {
                (!user.recordAccess && !otpSent) ?
                   <div style={{display : "inline-block", marginTop:'5%', padding:'5%'}} className="card col-md-4  text-center">

                    <form onSubmit={generate_OTP}>
                        You need to enter the OTP we will send on your registered email id to access this page <br></br>
                        <button type="submit" style={{margin:'10%'}}> Generate OTP </button>
                    </form>
                    </div>
                    : <></>
            }
            { (!user.recordAccess && otpSent) ?
              <div style={{display : "inline-block", marginTop:'5%', padding:'5%'}} className="card col-md-4  text-center">

                <form onSubmit={verify_OTP}> 
                    Enter OTP we just sent on your registered email id to access the page:
                    <br></br>
                     <input type="text" style={{marginTop:'5%'}} onChange={e => setOtpEntered(e.target.value)} value={otpEntered} name="otp"></input> <br></br> <br></br>
                    <button type="submit"> Verify </button>
                </form>
                </div>
                : <></>
            }

            {
            user.recordAccess && 
            <div style={{display : "inline-block", marginTop:'5%', padding:'5%'}} className="card col-md-4  text-center">

            <form onSubmit={form_submit}>
            File : <input type="file" onChange={ handleFileChange } name="file"></input> <br></br> <br></br>
            Enter Description: <input type="text" onChange={e => setDesc(e.target.value)} value={desc} name="desc"></input> <br></br><br></br>

            <button type='submit'> Upload </button>
        </form>   
        </div>
            }          
   </div>
 );
};

export default File;