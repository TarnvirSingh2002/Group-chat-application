import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [data, setdata]=useState({
            name:"",
            email:"",
            password:""
        });

        const navigateto=useNavigate();
        const handleClick=async(e)=>{
            e.preventDefault();
            await axios.post('http://localhost:5000/api/use/sith', {
                name:data.name,
                email: data.email,
                password: data.password
              })
              .then(response => {
                console.log('Response:', response.data);
              })
              .catch(error => {
                console.error('Error posting data:', error);
              });
              navigateto("/");
        }

        const handlechange=(e)=>{
            e.preventDefault();
            setdata({...data,[e.target.name]:e.target.value});
        }

  return (
    <div>
      <form onSubmit={handleClick}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                    <input type="string" name="name" value={data.name} onChange={handlechange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                </div>
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
    </div>
  )
}
