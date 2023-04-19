import { useParams, useLocation } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { UserContext } from './UserContext';
import Unauthorized from './Unauthorized';

function Record() {
  const [file, setFile] = useState(null);
  const { id } = useParams(); // contain the id of the record to be retrieved
  const { user, setUser } = useContext(UserContext);
  const {state} = useLocation();
  console.log(state);
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
              method:"POST",
              withCredentials:true,
              url:'/records/' + id,
              params: {
        
              },
            }).then((res) => {
                setFile(res.data);
              });
          }
  , [user]);
  
  // if(!state || !state.verified){
  //   return <h2> {"You are not verified to view this page"} </h2>
  // }
  if(!user.username || user.username=="") return <Unauthorized />   
  else if(!user.recordAccess) return <></>
  else
  return (

    <div>
      <h3>{file && file.filename}</h3>
      <p> {file && file.desc} </p>
      {
        file && <> <a href={`data:${file.contentType};base64,${file.base64}`}>
        Click here to download the file.
      </a> <br></br> </>
      }

      {file && (
        <object target="_blank"
          data={`data:${file.contentType};base64,${file.base64}`}
          type={file.contentType}
          width="auto"
          height="auto"
        >
          <p>
            Your browser does not support the file format.{" "}
          </p>
        </object>
      )
      }
      
      
    </div>
  );
}

export default Record;