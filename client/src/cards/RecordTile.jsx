import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import { UserContext } from '../components/UserContext';


// Props conatin the RECORDS'S _id
const RecordTile = ({_id, verified}) => {
    const [recordInfo, setRecordInfo] = useState({});
    // const [file, setFile] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const [message, setMessage] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [deleted, setDeleted] = useState(false);


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
            url:'/record-info',
            data: {
                _id: _id
            },
        }).then((res) => {
            if(res.data) setRecordInfo(res.data);
            });
    }, []);

    // function submit_handler(event){
    //     event.preventDefault();
    //     console.log("in");
        
        
    // }
    // useEffect(()=>{
    //     Axios({
    //         method:"POST",
    //         withCredentials:true,
    //         url:'/records/' + _id,
    //         params: {
      
    //         },
    //       }).then((res) => {
    //           setFile(res.data);
    //         });
    //     }, []);

    function handleClick(event){
      event.preventDefault();
      setConfirm(true);
    }

    function handleDelete(event){
      event.preventDefault();
      Axios({
        method:"POST",
        withCredentials:true,
        url:'/records/delete/' + _id,
        data: {
            
        },
    }).then((res) => {
          setDeleted(res.data.success);
          setMessage(res.data.message);
          setConfirm(false);
      });

    }

    function handleNo(event){
      event.preventDefault();
      setConfirm(false);
    }



    return (
        
                 <div style={{display : "inline-block", margin:'5px'}} className="card col-md-4  text-center">
  <div className="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
    {/* <img src="https://mdbcdn.b-cdn.net/img/new/standard/nature/111.webp" className="img-fluid"/> */}
    
    <div className="mask" style={{backgroundColor: "rgba(21, 251, 251, 0.15)"}}></div>
      {/* <NavLink to={"/records/" + _id } state={{ state: 'mystate' }} target="_blank" >
                <button>
                <h2> Name: {recordInfo.name} </h2>
                <p> Desc: {recordInfo.desc} </p>
                <p> Uploaded On: {recordInfo.createdAt} </p>
                </button>  
            </NavLink>                     */}

            
                {/* <div>
                <h2> Name: {recordInfo.name} </h2>
                <p> Desc: {recordInfo.desc} </p>
                <p> Uploaded On: {recordInfo.createdAt} </p>

                {recordInfo.name && <> <a target="_blank" href={`data:${recordInfo.contentType};base64,${recordInfo.base64}`}>
                Download
                    </a> </>} 
                </div>   
                 */}
  </div>
  <div className="card-body">
    {
      !deleted && <div>
          <h5 className="card-title"> Name: {recordInfo.name} </h5>
    <p className="card-text">  Desc: {recordInfo.desc}</p>
    <p className="card-text">  Uploaded On: {recordInfo.createdAt} </p>
        
    
  
    <Link to={"/records/" + _id } target="_blank" > <button className="btn btn-primary"> View </button></Link>
    &nbsp;  &nbsp;  &nbsp;
    <button className="btn btn-danger" onClick={handleClick}> Delete </button>
    </div>
    }

    {
      confirm && <div>
          <h4> Are you sure you want to delete this record?</h4>
          <button className="btn btn-danger" onClick={handleDelete}> Yes. Delete it. </button>
          <buttton className="btn btn-primary" onClick={handleNo}> No. </buttton>
        </div>
    }
    
    {
      message!="" && <h3>{message}</h3>
    }

  </div>
</div>
            
      
            
        
    );
};

export default RecordTile;