import * as React from 'react';
import Axios from "axios";
import { useState, useEffect, useContext } from 'react';
import Unauthorized from './Unauthorized';
import { UserContext } from './UserContext';
import symptoms from "../public/symptoms.json";
import { Link } from 'react-router-dom';

const DiseasePrediction = () => {
    const { user, setUser } = useContext(UserContext);
    const [checkedState, setCheckedState] = useState({
    });
    const [hide, setHide] = useState({});
    const [selected, setSelected] = useState([]);
    const [changed, setChanged] = useState(true);
    const [msg, setMsg] = useState('');
    const [filter, setFilter] = useState('');
    const [diseases, setDiseases] = useState(null);

    
    symptoms['symptoms'].sort();
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
        setMsg('')
        const sel = [];
        Object.keys(checkedState).map((key, index) => {
            if(checkedState[key]){
                sel.push(key)
            }
        });
        setSelected(sel);
    }, [changed])

    useEffect(()=>{
        const hide_new = {};
        if(filter === '' || filter===null){
            setHide(hide_new);
            return;
        }
        symptoms['symptoms'].map(symptom => {
            var regex = new RegExp(filter, "i");
            var result = symptom.match(regex);
           
            if(result){
                hide_new[symptom] = false;
            }
            else{
                hide_new[symptom] = true;
            }
        });
        setHide(hide_new);
    }, [filter]);


    function handleOnChange(symptom){
        var val = false;
        if(!checkedState[symptom]){
            val = true;
        }
        
        setCheckedState(checkedState => ({...checkedState, [symptom]: val}));
        setChanged(!changed);
    }

    function showSymptom(symptom){
        if(!hide[symptom])
        return (
            <li key={symptom}>
                
                <input type="checkbox" id={symptom} name={symptom} value={symptom} checked={checkedState[symptom]}
                    onChange={() => handleOnChange(symptom)}/>
                <label htmlFor={symptom}> {symptom} </label>
    
            </li>
        );
    }

    

    function handleSubmit(event){
        event.preventDefault();
        if(selected.length<3){
            setMsg("Please select atleast 3 symptoms");
            return;
        }
    
        Axios({
            method: "POST",
            withCredentials: true,
            url: '/prediction',
            data: {
              symptoms : selected
            },
          }).then((res) => {
            if(res.data.success){
                setDiseases(res.data.diseases);
            }
            
            else{
                setMsg(res.data.message);
            }
          });
    }

    function showDisease(disease){
        return (
            <div key={disease.disease}>
                <h3>{disease.disease}  : {disease.prob} %</h3>
                <p>{disease.info}</p>
                <a href={disease.link}> Know more about {disease.disease} </a>
                <br></br>
                <br></br>
                <p> Common Symptoms : 
                    {
                        disease.symptoms.map((symptom)=>(
                            <p>{symptom}</p>
                         ))
                    }
                </p>
                <Link to={"/doctors/disease?disease=" + disease.disease.trim()} target='_blank'> 
                <button className="btn btn-success"> Find Doctor For {disease.disease} </button></Link>

                <br></br>
                <br></br>
            </div>
        )
    }
 
  if(!user.username || user.username=="") return <Unauthorized />
  else
 return (
    <div>
    <h5>{msg}</h5>
    { !diseases && 
    <div>
        
        Symptoms Selected: {
            selected.map((symptom)=> (symptom + ", "))
        }

        <br></br> <br></br>

        Search for Symptoms <input type='text' name={filter} value={filter} onChange={(event) => setFilter(event.target.value)}></input> 

        <br></br> <br></br>
        <form onSubmit={handleSubmit}>

            <input type="submit" value="Predict" /> <br></br> <br></br>
            {symptoms['symptoms'].map((symptom) => showSymptom(symptom))}

        </form>

    </div>
    }

    { 
        diseases && <h4> Symptoms Selected </h4>
    }
     
    {
        diseases && selected.map((symptom)=> (symptom + ", "))
    }
    <br></br> <br></br>
    {
        // diseases && diseases.map(disease => {
        //     return <h3 key = {disease.disease}> {disease.disease} : {disease.prob} %</h3>;
        // })

        diseases && diseases.map(disease => showDisease(disease))

    }
    </div>
 
 
 );
};

export default DiseasePrediction;