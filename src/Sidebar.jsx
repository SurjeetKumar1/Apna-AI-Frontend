import React, { useContext, useEffect } from 'react';
import { MyContext } from './MyContext';
import {v1 as uuidv1} from "uuid";
import "./sidebar.css"
import { BACKEND_URL } from './config';
function Sidebar() {
   const {allThreads,setAllThreads,reply,currThreadID,setCurrThreadID,setNewChat,setPrompt,setReply,setPrevChats}=useContext(MyContext);

   const getAllThreads=async()=>{
     try{
      const token = localStorage.getItem("token");
// const respose=await fetch("http://localhost:8080/api/thread",{
   const respose=await fetch(`${BACKEND_URL}/api/thread`,{
   method: "GET",
   headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}` 
   }
});
const res=await respose.json();
const filterData=res.map((thread)=>({
    threadId:thread.threadId,
    title:thread.title
}))
setAllThreads(filterData);
     }catch(err){
      console.log(err);
     }
   }

   const createNewChat=()=>{
      setNewChat(true);
      setReply("");
      setPrompt(null);
      setCurrThreadID(uuidv1());
      setPrevChats([]);
   }

   useEffect(()=>{
      getAllThreads();

   },[currThreadID,reply])

   const changeThread=async(threadId)=>{
       setCurrThreadID(threadId);
       try{
         // let response=await fetch(`http://localhost:8080/api/thread/${threadId}`);
         let response=await fetch(`${BACKEND_URL}/api/thread/${threadId}`);
         response=await response.json();
         console.log(response);
         setPrevChats(response);
         setNewChat(false);
         setReply(null)
       }catch(err){
         console.log(err);
       }
   }

   const deleteThread=async(threadId)=>{
      const options={
         method:"DELETE"
      }
      try{
         // let response=await fetch(`http://localhost:8080/api/thread/${threadId}`,options);
         let response=await fetch(`${BACKEND_URL}/api/thread/${threadId}`,options);
         response=await response.json();
         console.log(response);
         
         //re-render updated Chat
         setAllThreads((prev)=>{
            return(
               prev.filter((thread)=>thread.threadId!==threadId)
            )
         })

         if(threadId===currThreadID){
            createNewChat()
         }

      }catch(err){
         console.log(err);
      }

   }
    return (  
       <section className='sidebar'>

        <button onClick={createNewChat}>
            {/* <img src='src/assets/blacklogo.png' alt='Apna GPT logo' className='logo'/> */}
            <img src='/apna-ai.png' alt='Apna Ai logo' className='logo'/>
            <span><i className="fa-solid fa-pen-to-square"></i></span>
        </button>

        <ul className='history'>
         {allThreads.length>0 && 
         allThreads.map((thread,indx)=>{
            return (
            <li key={indx} onClick={()=>changeThread(thread.threadId)}
            className={thread.threadId===currThreadID?"highlighted":""}
            >
               {thread.title} 
               <i className="fa-solid fa-trash"
               onClick={(e)=>{
                  e.stopPropagation();    //stop[ event bubbling]
                  deleteThread(thread.threadId);
               }}
               ></i></li>
            )
         })
         }
        </ul>

        <div className='sign'>
           <p>By Surjeet &hearts;</p>
        </div>
       </section>
    );
}

export default Sidebar;