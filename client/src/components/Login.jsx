import Axios from "axios";
import React,{useState, useEffect,useContext} from "react";
import { UserContext } from './UserContext';
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import "./login.css";
import ModalRedirect from "./ModalRedirect";


function Login(){ 
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [message,setMessage] = useState({});
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const[isVisible, setIsVisible] = useState(false);
    useEffect(()=>{
        Axios({
          method: "POST",
          withCredentials: false,
          url: 'https://health-bot-backend.onrender.com/auth/user',
          data: {
            
          },
        }).then((res) => {
          console.log("resfrom ", res.data);
          setUser({...res.data});
        });
      }, []);


    useEffect(()=>{
        setMessage({});
        setIsVisible(false);
    },[username,password]);

    useEffect(()=>{
      if( !message.message || message.message=="") setIsVisible(false);
      else setIsVisible(true);
   },[message]);

    function login_submit(event){
        event.preventDefault();
        if(username == "" || password==""){
          setMessage({message:"Field is missing"});
          return;
        }
        Axios({
            method:"POST",
            withCredentials:false,
            url:'https://health-bot-backend.onrender.com/auth/login',
            data:{
                username:username,
                password:password
            }
    }).then(
        (res)=>{
            setMessage({success : res.data.success, message: res.data.message});
            setIsVisible(true);
            console.log("res ", res.data);
            if(res.data.success){
             
                Axios({
                    method: "GET",
                    withCredentials: false,
                    url: 'https://health-bot-backend.onrender.com/auth/user',
                    params: {
              
                    },
                  }).then((res) => {
                    setUser({...res.data});
                  });
            }
        }
    );
    }
    if(user.username){
      return navigate("/", { replace: true });
    }
else
return(
    <div>

    {isVisible  && <ModalRedirect message={message.message} isVisible={isVisible} setIsVisible={setIsVisible} redirectLocation={"/"}/>}

    {isVisible && !message.success && <Modal message={message.message} isVisible={isVisible} setIsVisible={setIsVisible}/>}
    
    <section className="h-100 gradient-form" style={{backgroundColor: "#eee"}}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-xl-10">
        <div className="card rounded-3 text-black">
          <div className="row g-0">
            <div className="col-lg-6">
              <div className="card-body p-md-5 mx-md-4">

                <div className="text-center">
                  {/* <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp" */}
                    {/* style="width: 185px;" alt="logo"> */}
                  <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
                </div>
               
                <form onSubmit={login_submit}>
                  <p>Please login to your account</p>

                  <div className="form-outline mb-4">
                    <input type="text" id="username" className="form-control" value = {username} onChange={e=>setUsername(e.target.value)}
                      placeholder="Enter your username"  />
                    <label className="form-label" htmlFor="username">Username</label>
                  </div>

                  <div className="form-outline mb-4">
                    <input type="password" id="password" className="form-control" value = {password} onChange={e=>setPassword(e.target.value)} />
                    <label className="form-label" htmlFor="password">Password</label>
                  </div>

                  <div className="text-center pt-1 mb-5 pb-1">
                    <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="submit">Log
                      in</button>
                    
                  </div>

                  <div className="d-flex align-items-center justify-content-center pb-4">
                    <p className="mb-0 me-2">Don't have an account?</p>
                    <Link to={"/signup"}>
                    <button type="button" className="btn btn-outline-danger">Create new</button>
                    </Link>   
                  </div>

                </form>

              </div>
            </div>
            <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
              <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                <h4 className="mb-4">We are more than just a company</h4>
                <p className="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</div>
)}

export default Login;