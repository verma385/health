import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import Axios from "axios";
import RecordTile from '../cards/RecordTile';
import { UserContext } from './UserContext';
import Unauthorized from './Unauthorized';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const DoctorRecord = () => {
    const { username } = useParams();
    
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [otpEntered, setOtpEntered] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const { user, setUser } = useContext(UserContext);
  const [recordUser, setRecordUser] = useState({});

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
        username : username
      },
    }).then((res) => {
      setRecordUser({...res.data[0]});
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
        username: recordUser.username,
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
          username: recordUser.username,
          toMail : recordUser.email,
          doctorName : user.name
        },
      }).then((res) => {
        // setMessage(res.data.message);
        if(res.data.success) setMessage("");
        else setMessage(res.data.message);
        setOtpSent(res.data.success);
        console.log(res.data);
      });
  }

  function verify_OTP(event){
    event.preventDefault();
    Axios({
        method: "POST",
        withCredentials: true,
        url: '/doctors/verify-otp',
        data: {
          username: recordUser.username,
          doctor: user.username,
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
  
    if(!user.username || user.username=="" || user.role != 'doctor' ) 
        return <Unauthorized message={"Only authorized doctors can view this page."}/>
    else

  return (
    <div>
        <div>
            <p> {message} </p>
            {
                (!user.userRecordAccess[recordUser.username] && !otpSent) ?
                   <div style={{display : "inline-block", marginTop:'5%', padding:'5%'}} className="card col-md-4  text-center">

                    <form onSubmit={generate_OTP}>
                        You need to enter the OTP we will send on the registered email id of the user "{recordUser.username}" to access this page <br></br>
                        <button type="submit" style={{margin:'10%'}}> Generate OTP </button>
                    </form>
                    </div>
                    : <></>
            }
            { ( !user.userRecordAccess[recordUser.username] && otpSent ) ?
              <div style={{display : "inline-block", marginTop:'5%', padding:'5%'}} className="card col-md-4  text-center">

                <form onSubmit={verify_OTP}> 
                    Enter OTP we just sent on your registered email id of the user "{recordUser.username}" to access the page:
                    <br></br>
                     <input type="text" style={{marginTop:'5%'}} onChange={e => setOtpEntered(e.target.value)} value={otpEntered} name="otp"></input> <br></br> <br></br>
                    <button type="submit"> Verify </button>
                </form>
                </div>
                : <></>
            }

        </div>
        
        {
            user.userRecordAccess[recordUser.username] && 
            <div>
                <h3>{recordUser.name}</h3>
                <Link to={"/user/" + user} target="_blank" > <button className="btn btn-primary"> View Profile </button></Link>

            </div>
        }
      {
        user.userRecordAccess[recordUser.username] && records.map((record) => {
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

export default DoctorRecord;