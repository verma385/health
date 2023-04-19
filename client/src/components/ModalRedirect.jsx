import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function ModalRedirect({message, isVisible, setIsVisible, redirectLocation, replace}) {
    const navigate = useNavigate();
    if(replace!==false){
        replace = true;
    }
  const modalStyle = {
    display: isVisible ? 'block' : 'none',
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  };

  const contentStyle = {
    backgroundColor: '#fefefe',
    margin: '15% auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
    maxWidth: '500px',
    textAlign: 'center',
  };
function handleClick(){
  navigate(redirectLocation, { replace: replace });
}
  return (
    <div>
      
      <div style={modalStyle} >
        <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h4>{"Hey user!"}</h4>
          <p>{message}</p>
          
          <button onClick={handleClick}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ModalRedirect;