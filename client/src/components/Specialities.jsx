import * as React from 'react';
import specialities from "../public/specialities.json";
// Props contain the RECEIVER'S Information
const Specialities = ({setSpeciality}) => {
  
    specialities["specialities"].sort();

    function showSpeciality(spec) {
        return <option key={spec} value={spec}> {spec} </option>;
    }

 return (
    <> 
        <div className="row">
            <div className="col-md-6 mb-4">
                <div className="form-outline">
                <select name="speciality"  onChange={e=>setSpeciality(e.target.value)} id="speciality">
                {
                    specialities["specialities"].map(sp=>showSpeciality(sp))
                }
                </select>
                <label htmlFor="speciality">Choose Speciality</label>
                </div>
            </div>
        </div>
        
      
    </>
    
   

 );
};

export default Specialities;