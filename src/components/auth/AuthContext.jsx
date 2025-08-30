import React, { createContext, useContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const savedToken = localStorage.getItem("token");
  const savedUserName=localStorage.getItem("username");
  const [username,setUsername]=useState(savedUserName || "");
  const [loading, setLoading] = useState(false);  
  const [isAuthenticated, setIsAuthenticated] = useState(!!savedToken);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (savedToken) {
      setIsAuthenticated(true);
      setToken(savedToken);
    }
    if(savedUserName){
      setUsername(savedUserName);
    }
  }, [savedToken,savedUserName]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/user/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username",response.data.username)
        setToken(response.data.token);
        setIsAuthenticated(true);
        setUsername(response.data.username);
        navigate("/");
      }

      return response.data.Message || "Login successful";
    } catch (err) {
      return err.response?.data?.Message || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (name, email, password) => {
    setLoading(true);
    console.log("inside handleCreateAccount",email,name,password);
    try {
      const response = await axios.post(`${BACKEND_URL}/user/create`, {
        name,
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username",response.data.username);
        setToken(response.data.token);
        setIsAuthenticated(true);
        setUsername(response.data.username);
        navigate("/");
      }

      return response.data.Message || "Signup successful";
    } catch (err) {
      return err.response?.data?.Message || "Signup failed";
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const authValues = {
    token,
    loading,
    isAuthenticated,
    handleLogin,
    handleCreateAccount,
    handleLogout,
    username
  };

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
