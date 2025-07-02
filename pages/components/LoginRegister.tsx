import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginRegister = () => {
    const { username, setUsername, password, setPassword, handleLogin, handleRegister } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    
    return (
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">{isLogin ? "Login" : "Register"}</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 mb-2 rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-2 rounded-lg"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            {isLogin ? "Login" : "Register"}
          </button>
          <p className="text-sm mt-2">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <span
              className="text-blue-600 hover:text-blue-700 cursor-pointer"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register" : "Login"}
            </span>
          </p>
        </form>
      </div>
    );
};

export default LoginRegister;
