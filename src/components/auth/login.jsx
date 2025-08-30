import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();
  const [message,setMessage]=useState("");
  const {handleLogin,loading}=useAuth();

  const handleLoginForm=async(e)=>{
    e.preventDefault();
    try{
      const response=await handleLogin(email,password);
        setMessage(response);
        console.log("login message",response);
      }
      catch(err){
      setMessage(err)
    }

  }

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <div className="">Login</div>
        </div>
        <div className="login-box" >
          {message && <div>{message}</div>}
          <div>
            <label className="label">Email address</label>
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
            <label className="label">Password</label>
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

          <div className="div">
          <button
          type="button"  
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={handleLoginForm}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          </div>

         
        </div>
        <div className="pass-box">
          <p>
            New to ApnaGPT? <Link to="/createAccount">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;