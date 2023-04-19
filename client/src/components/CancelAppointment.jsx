import { useParams, useLocation } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { UserContext } from './UserContext';
import Unauthorized from './Unauthorized';
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ModalRedirect from "./ModalRedirect";
import Modal from "./Modal";

function CancelAppointment() {
  const { user, setUser } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
    const [doctor, setDoctor] = useState({});
    const [message, setMessage] = useState(null);
    const [exist, setExist] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const doctorUserName =  searchParams.get("doctor");
    const time = searchParams.get("time");
    const date = searchParams.get("date");

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
        username : doctorUserName
      },
    }).then((res) => {
      setDoctor(res.data[0]);
    });
  }, []);

  useEffect(()=>{
    Axios({
        method: "POST",
        withCredentials: true,
        url: '/exists-appointment',
        data: {
          username : user.username,
          doctor : doctorUserName,
          date : date,
          time : time
        },
      }).then((res) => {
        setExist(res.data.exist);
        setMessage(res.data.message);
        setIsVisible(true);
      });
  }, [user])

  function handleSubmit(event){
    event.preventDefault();
    Axios({
        method: "POST",
        withCredentials: true,
        url: '/users/cancel-appointment',
        data: {
          username : user.username,
          doctor : doctorUserName,
          date : date,
          time : time
        },
      }).then((res) => {
        setMessage(res.data.message);
        setCancelled(res.data.success);
        setIsVisible(true);
      });
  }
  
  
  if(!user.username || user.username=="") return <Unauthorized />   
 
  else
  return (

    <div>
      
      {isVisible && cancelled && <ModalRedirect message={message} isVisible={isVisible} setIsVisible={setIsVisible} redirectLocation={"/users/my-appointments"}/>}

      {isVisible && !cancelled && message && message!="" && <ModalRedirect message={message} isVisible={isVisible} setIsVisible={setIsVisible} redirectLocation={"/users/my-appointments"}/>}


        {
            exist && !cancelled &&
            <div>
                <h4> Are you sure you want to cancel the following appointment </h4>
                <h3> Date : {date} </h3>
                <h3> Time : {time} </h3>
      {/* <h3> Doctor's Details </h3>
            <h5> Name : {doctor.username} </h5> */}
            {/* <h5> UserName : {doctor.name} </h5>
            <h5> Speciality: {doctor.speciality} </h5>
            <h5> Clinic : {doctor.clinic} </h5>
            <h5> City :  {doctor.city} </h5>
            <h5> State : {doctor.state} </h5>
            <h5> Email : {doctor.email} </h5>
            <h5> Contact : {doctor.contact} </h5> */}
                <h3> Doctor Name : {doctor.name} </h3>
                <Link to={"/user/" + doctor.username} target="_blank" > <button className="btn btn-primary"> View Doctor's Profile </button></Link>

                <br></br> <br></br>
                <form onSubmit={handleSubmit}>
                 <button type="submit" className="btn btn-danger">Cancel</button>
                </form>
            </div>

        }

      
      
      
    </div>
  );
}

export default CancelAppointment;