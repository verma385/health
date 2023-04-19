
import * as React from 'react';
import Axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Unauthorized from './Unauthorized';
import { UserContext } from './UserContext';
import { useState, useEffect, useContext } from 'react';



const DoctorRecordPage = () => {
  
  const { user, setUser } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [hide, setHide] = useState({});
  const [filter, setFilter] = useState('');

  function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
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
      url: '/doctors/my-appointments',
      data: {
        username: user.username || "abc"
      },
    }).then((res) => {
        var result = []
        var tem = res.data;
          
        tem.map((appt) => {
            result.push(appt.username);
        });
        result = removeDuplicates(result);
        setUsers([...result]);
    });
  }, [user]);


  useEffect(()=>{
    const hide_new = {};
    if(filter === '' || filter===null){
        setHide(hide_new);
        return;
    }
    users.map((user) => {
        if(!user) return;
        var regex = new RegExp(filter);
        var result = user.match(regex);
       
        if(result){
            hide_new[user] = false;
        }
        else{
            hide_new[user] = true;
        }
    });
    setHide(hide_new);
}, [filter, users]);



  function showUser(user){
    if(hide[user]){
        return <></>
    }
    return (
        <div>
            <p>{user}</p>
            <Link to={"/user/" + user} target="_blank" > <button className="btn btn-primary"> View Profile </button></Link>
            <Link to={"/doctors/user-records/" + user} target="_blank" > <button className="btn btn-primary"> View Records </button></Link>

        </div>
    )
  }

  

//   if(!user.username || user.username=="" || user.role!="doctor") return <Unauthorized />
//   else
  return (
    <div>

    Search for User <input type='text' name={filter} value={filter} onChange={(event) => setFilter(event.target.value)}></input> 

      
      {
        users.map(user => showUser(user))
      }

    </div>
  );
}

export default DoctorRecordPage;