import React, { useState } from 'react';

function Modal({message, isVisible, setIsVisible}) {

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

  return (
    <div>
      
      <div style={modalStyle} >
        <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h4>{"Hey user!"}</h4>
          <p>{message}</p>
          
          <button onClick={() => {setIsVisible(false)}}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;