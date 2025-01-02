import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import {context} from "../index.js"

export default function Login() {

    const {settoken,authenticate,setauthenticate,setuserid}= useContext(context);

    const [data, setdata]=useState({
        email:"",
        password:""
    });
    const navigateto=useNavigate();

    const handlechange=(e)=>{
        setdata({...data, [e.target.name]:e.target.value});
    }

    const handleClick=async(e)=>{
        e.preventDefault();
        await axios.post('http://localhost:5000/api/use/log', {
            email: data.email,
            password: data.password
          })
          .then(response => {
            console.log('Response:', response.data.token);
            settoken(response.data.token);
            setuserid(response.data.userId);
          })
          .catch(error => {
            console.error('Error posting data:', error);
          });
        setauthenticate(true);
    }

    if(authenticate){
        return <Navigate to='/chatbox'/>
    }

    const takeMe=()=>{
        navigateto("/signin");
    }

    return (
        <div>
            <form onSubmit={handleClick}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" name="email" value={data.email} onChange={handlechange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" name="password" value={data.password} onChange={handlechange} className="form-control" id="exampleInputPassword1"/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <div onClick={takeMe} style={{width:"200px", backgroundColor:"pink"}}>Register yourself</div>

        </div>
    )
}
