import React, { useContext, useEffect, useState } from 'react';
import "./chatWindow.css"
import Chat from "./Chat.jsx"
import { MyContext } from './MyContext.jsx';
import {ScaleLoader,HashLoader} from "react-spinners";
import { useAuth } from './components/auth/AuthContext.jsx';
import { v1 as uuidv1 } from "uuid";
function ChatWindow() {
    const {prompt,setPrompt,reply,setReply,currThreadID,setCurrThreadID,setAllThreads,setPrevChats,setNewChat}=useContext(MyContext);
    const [loading,setLoading]=useState(false);
    const [isOpen,setIsOpen]=useState(false);  //set to deafult false
    const {handleLogout,username}=useAuth();

    const getreply=async()=>{
        console.log("token inside chat window",localStorage.getItem("token"));
        setLoading(true);
        setNewChat(false);
        const options={
            method:"POST",
            headers:{
                "Content-type":"application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            },
            body:JSON.stringify({
                message:prompt,
                threadId:currThreadID,
                // token:localStorage.getItem("token")
            })
        }
        
        try{
         let response=   await fetch("http://localhost:8080/api/chat",options);
          response=await response.json();
          console.log(response.reply);
         setReply(response.reply);
        }catch(err){
            console.log(err);
        }
        setLoading(false);

    }

    const logout=()=>{
        setPrompt("");
        setReply(null);
        setPrevChats([])
        setAllThreads([]);
        setNewChat(true);
        setCurrThreadID(uuidv1());
        handleLogout();
        
    }

    //apend new chat to prev Chat
    useEffect(()=>{
        if(prompt&& reply){
            setPrevChats(prevChats=>(
                [...prevChats,{
                    role:"user",
                    content:prompt
                },
            {
                role:"assistant",
                content:reply
            }
            ]
            ))
        }
        setPrompt("");

    },[reply])
    return (  
        <div className='chatWindow'>
           <div className='navbar'>
           <span>Apna AI <i className="fa-solid fa-chevron-down"></i></span>
           
           <div className="userIconDiv" onClick={()=>{setIsOpen(!isOpen)}} style={{display:'flex',justifyContent:"center",alignItems:"center"}}>
           Hey, {username}
           <span className='userIcon'> <i className="fa-solid fa-user"></i></span>
            </div>
           </div>
           {isOpen &&
            <div className='dropDown'>
           <div className='dropDownItems'><i className="fa-solid fa-gear"></i> Settings</div>
           <div className='dropDownItems'><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan </div>
           <div className='dropDownItems'
           onClick={logout}
           ><i className="fa-solid fa-right-from-bracket"></i> Log Out</div>
           </div>
           }
           <Chat></Chat>
           <HashLoader 
           color='#fff' size={35}
           loading={loading}
           ></HashLoader>
           <div className='chatInput'>
            <div className='inputBox'>
                <input placeholder='Ask anything'
                value={prompt}
                onChange={(e)=>setPrompt(e.target.value)}
                onKeyDown={(e)=>e.key==='Enter'?getreply():''}
                />
                <div id="submit" onClick={getreply}>
                <i className="fa-solid fa-paper-plane"></i>
                </div>
            </div>
            <p className='info'>Apna AI can make mistakes. Check important info. See Cookie Preferences.</p>
           </div>
        </div>
    );
}

export default ChatWindow;