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


    useEffect(() => { // it initially run and run again on every socket change
      socket.on('newMessage',(newMessage)=>{
        setmessages((prv)=>[...prv,newMessage])
      })
  
      return () => {
        socket.disconnect();
      };
    }, [socket]);

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
                  setmessag("");
            } catch (error) {
                console.log(error);
            }
        }

        // useEffect(() => {
        //   const fetchNames = async () => {
        //     const nameMap = {};
        //         try {
        //           const response = await axios.get(`http://localhost:5000/api/use/findName/${element.link}`);
        //           nameMap[element.link] = response?.data?.name || '';
        //         } catch (error) {
        //           console.error('Error fetching name:', error);
        //         }
        //     setname(nameMap); // Store all names in one go after fetching them
        //   };
      
        //   if (messages.length > 0) { // Only fetch names if there are messages
        //     fetchNames();
        //   }
        // }, [messages]);

        // const getMessageStyle = (senderId) => {
        //   if (senderId === userId) {
        //     return {
        //       display: "inline-block",
        //       padding: "15px 30px", 
        //       backgroundColor: "pink",  
        //       color: "black", 
        //       borderRadius: "60%",  
        //       fontSize: "16px",  
        //       textAlign: "center" , 
        //       verticalAlign: "middle" ,
        //       whiteSpace: "nowrap" 
        //     };
        //   } else {
        //     return {
        //       display: "inline-block",
        //       padding: "15px 30px", 
        //       backgroundColor: "rgb(185, 161, 118)",  
        //       color: "black", 
        //       borderRadius: "60%",  
        //       fontSize: "16px",  
        //       textAlign: "center" , 
        //       verticalAlign: "middle" ,
        //       whiteSpace: "nowrap" 
        //     };
        //   }
        // }
        
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: "30vh"
    }}>
    <div className="message-box">
    <div className="chat-window">
      {messages.map((element, index) => (
        <div
          key={index}
        >
          <p //style={getMessageStyle(element.link)}
          >{element.mess}
            {/* <small> {name[element.link]}</small>  */}
          </p>
        </div>
      ))}
    </div>
    <div className="input-box">
      <input type="text" value={messag} onChange={handleChange} placeholder="Type a message..."/>
      <button onClick={handleSend}>Send</button>
      <div onClick={outplease}>Log Out</div>
    </div>
  </div>
  </div>
  )
}
