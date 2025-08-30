import React, { useState, useEffect, use } from "react";
import axios from "axios";
import "./auth.css";

import { Link, useAsyncError, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const CreateAccount = () => {
   const {handleCreateAccount,loading}=useAuth();

  const [name,setName]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  const [message,setMessage]=useState("");
  const navigate=useNavigate();

  const AccountCreateForm=async(e)=>{ 
    e.preventDefault();
    try{
     const response=await handleCreateAccount(name,email,password);
     console.log("response Message",response);
     setMessage(response);

    }catch(err){
    console.log("err message",err);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <div >Create an Account </div>
        </div>

        <div className="login-box">
          {message &&<div>{message}</div>}
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input
              autoComplete="off"
              name="name"
              id="name"
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="Email">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="div">
            <label className="label" htmlFor="Password">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button style={{fontWeight:"bold"}}
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={AccountCreateForm}
          >
            {loading ? "Loading..." : "Create"}
          </button>
        </div>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;