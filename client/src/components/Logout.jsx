import * as React from 'react';
import { useContext, useState, useEffect} from 'react';
import { UserContext } from './UserContext';
import Axios from "axios";
import Unauthorized from './Unauthorized';
import { useNavigate } from 'react-router-dom';

import ModalRedirect from './ModalRedirect';

const Logout = () =>  {
   const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [message, setMessage] = useState();
    const[isVisible, setIsVisible] = useState(false);

    useEffect(()=>{
      Axios({
        method: "POST",
        withCredentials: true,
        url: '/auth/user',
        data: {
          
        },
      }).then((res) => {
        setUser(res.data);
        if(!res.data.username){
          navigate("/", { replace: true });
        }
      });
    }, []);

    React.useEffect(()=>{
        Axios({
         method:"GET",
         withCredentials:true,
         url:'/auth/logout',
           params: {
     
           },
       }).then((res) => {
         setUser({});
         setMessage(res.data);
         setIsVisible(true);
       });
     }, [user]);
     
    return <div>
      {isVisible && <ModalRedirect message={message.message} isVisible={isVisible} setIsVisible={setIsVisible} redirectLocation={"/"}/>}

      
    </div>
}
export default Logout;