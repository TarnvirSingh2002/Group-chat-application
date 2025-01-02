import React, { useContext, useEffect, useRef, useState } from 'react'
import "../App.css"
import axios from 'axios';
import { context } from "../index.js"
import { Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
export default function ChatBox() {

  const [messages, setmessages] = useState([]);
  const [messag, setmessag] = useState("");
  const { token, authenticate, setauthenticate, userid } = useContext(context);

  const [names, setNames] = useState({});//used to get all names

  const messageEndRef = useRef(null);


  const socket = io('http://localhost:5000');


  useEffect(() => { // it initially run and run again on every socket change
    socket.on('newMessage', (newMessage) => {
      setmessages((prv) => [...prv, newMessage])
    })

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const fetchdata = async () => {
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

  //useEffect is used to get all names
  useEffect(() => {
    if (messages.length > 0) {
      messages.forEach((el) => fetchNames(el));
    }
  }, [messages]);



  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth'});
    }
  }, [messages]);



  if (!authenticate) {
    return <Navigate to='/' />
  }

  const handleChange = (e) => {
    setmessag(e.target.value);
  }

  const outplease = () => {
    setauthenticate(false);
  }

  const handleSend = async () => {
    if (messag.trim() === "") return;
    try {
      await axios.post('http://localhost:5000/api/use/message',
        { mess: messag },
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

  const handleKeyDown = async(e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
    } 

    //edited
    const fetchNames = async (element) => {
      try {
        if(names[element.link] || names[element.link]!=null) return;
        const response = await axios.get(
          `http://localhost:5000/api/use/findName/${element.link}`
        );
        const ans = response?.data?.name || "";
        setNames((prev) => ({ ...prev, [element.link]: ans }));
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };
  

  const getsty = (id) => {
    if (id === userid) {
      return {
        display: "inline-block",
        padding: "15px 30px",
        backgroundColor: "rgb(185, 161, 118)",
        color: "black",
        borderRadius: "60%",
        fontSize: "16px",
        textAlign: "center",
        verticalAlign: "middle",
        whiteSpace: "nowrap"
      }
    }
    else{
      return {
        display: "inline-block",
        padding: "15px 30px",
        backgroundColor: "pink",
        color: "black",
        borderRadius: "60%",
        fontSize: "16px",
        textAlign: "center",
        verticalAlign: "middle",
        whiteSpace: "nowrap"
      }
    }
  }

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
              <p style={getsty(element.link)}
              >{element.mess}
              </p>
              <span style={{color:"red",fontSize:"13px"}}>{names[element.link]}</span>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <div className="input-box">
          <input type="text" value={messag} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Type a message..." />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
      <div onClick={outplease}>Log Out</div>
    </div>
  )
}
