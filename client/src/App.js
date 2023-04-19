import logo from './logo.svg';
import './App.css';
import './components/Signup'
import  Axios from 'axios';
import Signup from './components/Signup';
import Login from './components/Login';
import User from "./components/User"
import Navbar from './components/Navbar';
import Record from "./components/Record";
import Records from './components/Records';
import Logout from './components/Logout';
import Doctors from './components/Doctors';
import Chat from './cards/Chat';
import Chats from './components/Chats';
import File from './components/File'
import { UserContext } from './components/UserContext';
import { createContext, useState, useContext, useMemo, useEffect} from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chats_new from './cards/Chats_new';
import DoctorPage from './components/DoctorPage';
import DiseasePrediction from './components/DiseasePrediction';
import DoctorMyAppointment from './components/DoctorMyAppointment';
import UserProfile from './components/UserProfile';
import UserMyAppointment from './components/UserMyAppointment';
import DoctorRecordPage from './components/DoctorRecordPage';
import DoctorRecord from './components/DoctorRecord';
import EditProfile from './components/EditProfile';
import CancelAppointment from './components/CancelAppointment';
import DoctorForDisease from './components/DoctorForDisease';
import ProfilePhoto from './components/ProfilePhoto';
import Home from './components/Home';


function App() {
  const [user, setUser] = useState({});
  
  const value = {user, setUser};
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

  return (
    <UserContext.Provider value={value}>
      
      
      <div className="App">
        <BrowserRouter>
          <Navbar />
          
          {/* <Chat username="def" /> */}
          
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            
            <Route path="/user" element={<User />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:username" element={<DoctorPage />} />
            <Route path="/chats/:username" element={<Chats_new />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/records" element={<Records />} />
            <Route path="/records/upload" element={<File />} />
            <Route path="/records/:id" element={<Record />} />

            <Route path="/prediction" element={<DiseasePrediction />} />
            <Route path="/doctors/my-appointments" element={<DoctorMyAppointment />} />
            <Route path="/users/my-appointments" element={<UserMyAppointment />} />
            <Route path="/doctors/user-records" element={<DoctorRecordPage />} />
            <Route path="/doctors/user-records/:username" element={<DoctorRecord />} />
            <Route path="/user/edit-profile" element={<EditProfile />} />

            <Route path="/users/cancel-appointment" element={<CancelAppointment />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/doctors/disease" element={<DoctorForDisease />} />
            
          </Routes>

        </BrowserRouter> 
      </div>
    </UserContext.Provider>

  );
}


export default App;
