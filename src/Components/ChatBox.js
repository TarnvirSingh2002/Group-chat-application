import React, { useContext, useEffect, useState } from 'react'
import "../App.css"
import axios from 'axios';
import {context} from "../index.js"
import { Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
export default function ChatBox() {

    const [messages, setmessages]=useState([]);
    const[messag, setmessag]=useState("");
    const {token, authenticate, setauthenticate} = useContext(context);

    const socket = io('http://localhost:5000'); 

    console.log(token);

    useEffect(() => {
        const fetchdata=async()=>{
            await axios.get('http://localhost:5000/api/use/allmessage')
          .then((response) => {
            setmessages(response.data);  
          })
          .catch((err) => {
            console.log(err.message);
          });
        }
        fetchdata();

        socket.on('newMessage', (newMessage) => {
            setmessag(prevMessages => [...prevMessages, newMessage]); // Add the new message to the messages state
        });

        return () => {
            socket.off('newMessage'); // Clean up the socket listener when the component unmounts
        };
    }, []);

      if(!authenticate){
        return <Navigate to='/'/>
    }

      const handleChange=(e)=>{
        setmessag(e.target.value);
      }

      const outplease=()=>{
        setauthenticate(false);
      }

      const handleSend=async()=>{
            try {
                await axios.post('http://localhost:5000/api/use/message',
                    { mess:messag },
                    {
                        headers: {
                            'auth-token': token,
                            'Content-Type': 'application/json'
                          }
                    })
                  .then((response) => {
                    console.log(response);
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });
                  socket.emit('sendMessage', { mess: messag });
        
                    setmessag(""); 
                
            } catch (error) {
                console.log(error);
            }
        }
  return (
    <div className="message-box">
    <div className="chat-window">
      {messages.map((element, index) => (
        <div
          key={index}
        >
          {element.mess}
        </div>
      ))}
    </div>
    <div className="input-box">
      <input type="text" value={messag} onChange={handleChange} placeholder="Type a message..."/>
      <button onClick={handleSend}>Send</button>
      <div onClick={outplease}>Log Out</div>
    </div>
  </div>
  )
}
