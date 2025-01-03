import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [data, setdata] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [photo, setphoto] = useState("");
  const [nphoto, setnphoto] = useState("");

  const navigateto = useNavigate();


  const handleClick = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('photo', nphoto); // Add the file to FormData

    await axios.post('http://localhost:5000/api/use/sith', 
      formData
    , {
      headers: {
        'Content-Type': 'multipart/form-data', // This is automatically set by FormData, but you can specify it explicitly if needed
      }
    })
      .then(response => {
        console.log('Response:', response.data);
        console.log(nphoto);
        navigateto("/");
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
  }

  const handlechange = (e) => {
    e.preventDefault();
    setdata({ ...data, [e.target.name]: e.target.value });
  }

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setphoto(reader.result);
      setnphoto(file);
    };
  }

  return (
    <div>
      <form onSubmit={handleClick}>

        <div>
          <img
            src={
              photo ? `${photo}` : "nothing"
            }
            alt="photo" height="100px"
          />
          <input type="file" onChange={handleAvatar} />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
          <input type="string" name="name" value={data.name} onChange={handlechange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" name="email" value={data.email} onChange={handlechange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" name="password" value={data.password} onChange={handlechange} className="form-control" id="exampleInputPassword1" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
