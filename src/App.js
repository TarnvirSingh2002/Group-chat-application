import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ChatBox from "./Components/ChatBox";

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/signin" element={<Register/>}/>
      <Route path="/chatbox" element={<ChatBox/>}/>
    </Routes>
    </BrowserRouter>
    
    </>
  );
}

export default App;
