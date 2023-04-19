import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import Axios from "axios";
import RecordTile from '../cards/RecordTile';
import { UserContext } from './UserContext';
import Unauthorized from './Unauthorized';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [otpEntered, setOtpEntered] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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
  

  useEffect (() =>{
    setMessage("");
  }, [otpEntered])

  useEffect(() => {
    Axios({
      method: "POST",
      withCredentials: true,
      url: '/records',
      data: {
        username: user.username,
      },
    }).then((res) => {
      setRecords(res.data);
    });
  }, [user]);

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
        // setMessage(res.data.message);
        if(res.data.success) setMessage("");
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
         setMessage(res.data.message);
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
  
    if(!user.username || user.username=="") return <Unauthorized />
    else

  return (
    <div>
        <div>
            <p> {message} </p>
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

        </div>

      {
        user.recordAccess && records.map((record) => {
          return <RecordTile key={record._id} _id={record._id} />
        })
      }

      {/* {
        records.map((record) => {
          return <RecordTile key={record._id} _id={record._id} verified={verified} />
        })
      } */}
    </div>
  );
}

export default Records;