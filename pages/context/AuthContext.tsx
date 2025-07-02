import { createContext, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io();
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    
    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await axios.post("/api/auth/login", { username, password });
        setToken(response.data.token);
        socket.auth = { token: response.data.token };
        socket.connect();
    };
    
    const handleRegister = async (e) => {
        e.preventDefault();
        await axios.post("/api/auth/register", { username, password });
    };
    
    const logout = () => {
        setToken("");
        socket.disconnect();
    };
    
    return (
      <AuthContext.Provider value={{ username, setUsername, password, setPassword, token, handleLogin, handleRegister, logout }}>
        {children}
      </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
