

import * as React from 'react';

// Props contain the RECEIVER'S Information
const Symptom = ({sym, symptom}) => {
  
 return (
    <> 
        <input type="checkbox" id={sym} name={sym} value={sym}> </input>
        <label for={sym}> {symptom} </label><br></br> 
    </>
   

 );
};

export default Symptom;