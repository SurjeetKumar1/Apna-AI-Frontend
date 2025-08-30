import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import "./chat.css";
import { MyContext } from './MyContext';
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight"
// import "highlight.js/styles/github.css"
import "highlight.js/styles/github-dark.css"

function Chat() {
    const [latestReply,setLatestReply]=useState(null);
    const {newChat,prevChats,reply}=useContext(MyContext);

    useEffect(()=>{
        //latestReply Seperate => typing effect create
        if(reply===null){
            setLatestReply(null);   //prev chat load
            return ;
        }

        if(!prevChats?.length){
            return;
        }
        const content=reply.split(" ");  //individiual words are stored

        let indx=0;
        const interval=setInterval(()=>{
          setLatestReply(content.slice(0,indx+1).join(" "));
          indx++;
          if(indx>=content.length) {
            clearInterval(interval);
          }
        },40)

        return ()=>clearInterval(interval);

    },[prevChats,reply])
    return ( 
        <>
            {newChat && <h1>Start a New Chat</h1>}
         <div className='chats'>
            {
                prevChats?.slice(0,-1).map((chat,indx)=>(
                    <div className={chat.role==='user'?"userDiv":"gptDiv"} key={indx}>
                        {
                            chat.role==="user"?<p className='userMessage'>{chat.content}</p>
                            :
                            // <p className='gptMessage'>{chat.content}</p>
                            <ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>
                        }
                    </div>

                ))
            }

            {
                prevChats.length>0 && (
                    <>{
                    latestReply===null ?(
                        <div className='gptDiv' key={"typing"}>
                        <ReactMarkdown rehypePlugins={rehypeHighlight}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                    </div>
                    ): 
                    prevChats.length>0 &&latestReply!=null && 
                <div className='gptDiv' key={"typing"}>
                    <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
                </div> 
                     }
                    </>
                )
            }

            {/* {
                prevChats.length>0 &&latestReply!=null && 
                <div className='gptDiv' key={"typing"}>
                    <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
                </div>
            }

          {
                prevChats.length>0 &&latestReply===null && 
                <div className='gptDiv' key={"typing"}>
                    <ReactMarkdown rehypePlugins={rehypeHighlight}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                </div>
            }  */}
            
         </div>
        </>
     );
}

export default Chat;