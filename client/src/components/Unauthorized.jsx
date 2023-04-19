import * as React from 'react';
import { Link } from 'react-router-dom';

const Doctor = ({message}) => {  
  if(!message){
    message = " Please log in to continue.";
  }
 return (
   <div>
        <h1> You are not authorized to access this page.  {message} </h1>
        <Link to={"/login"}> 
            <button>
                Login
            </button>
        </Link>      
   </div>
 );
};

export default Doctor;