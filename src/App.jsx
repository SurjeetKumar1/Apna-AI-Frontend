import './App.css'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import { MyContext } from './MyContext'
import { useState } from 'react'
import { v1 as uuidv1 } from "uuid";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './components/auth/login'
import CreateAccount from './components/auth/CreateAccount'
import { useAuth } from './components/auth/AuthContext'

function App() {
  
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadID, setCurrThreadID] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const { isAuthenticated, loading } = useAuth();   

  const providerValues = {    
    prompt, setPrompt,
    reply, setReply,
    currThreadID, setCurrThreadID,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/createAccount" element={<CreateAccount />} />

          <Route 
            path="/" 
            element={
              loading ? (
                <div>Loading...</div> 
              ) : isAuthenticated ? (
                <div className="chat-container">
                  <Sidebar className="sidebar" />
                  <ChatWindow className="chat-window" />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }

          />
        </Routes>
      </MyContext.Provider>
    </div>
  );
}

export default App;
