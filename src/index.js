import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

export const context = createContext();

const Bin = () => {
  const [authenticate, setauthenticate] = useState(false);
  const [token, settoken] = useState("");
  return (<>
    <context.Provider value={{ authenticate, setauthenticate, token, settoken }}>
      <App />
    </context.Provider>
  </>);
}
root.render(
  // <React.StrictMode>
    <Bin />
  // </React.StrictMode>
);

// reportWebVitals();
