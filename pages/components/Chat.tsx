import Head from "next/head";
import Script from "next/script";
import { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";

const socket = io();

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const { username } = useContext(AuthContext);
    const chatLogRef = useRef(null);
    
    useEffect(() => {
        const handleReceiveMessage = (msg) => {
            if (msg.username === username) return;
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("receive-message", handleReceiveMessage);
        return () => socket.off("receive-message", handleReceiveMessage);
    }, []);

    useEffect(() => {
        const chatLog = chatLogRef.current;
        if (chatLog) {
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;
        const msg = {
            role: "user",
            username: username,
            text: inputValue
        };
        setMessages((prev) => [...prev, msg]);
        socket.emit("send-message", msg);
        setInputValue("");
    };

    const renderMessage = (msg, idx) => {
        const isMe = msg.username === username;
        
        return (
          <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"} px-4 py-2`}>
            {!isMe && (
              <img
                src="https://placehold.co/300x300?text=Avatar"
                className="rounded-full h-6 w-6 mr-2"
                alt="Avatar"
              />
            )}
            <div className={`relative ${isMe ? "bg-gray-800" : "bg-blue-800"} text-white rounded-xl px-4 py-3 shadow-md max-w-xs break-words`}>
              {!isMe && (
                <div className="text-sm text-blue-300 font-semibold mb-1">{msg.username}</div>
              )}
              {msg.text.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              <span className={`absolute top-0 ${isMe ? "right-0 border-t-gray-800 border-l-transparent" : "left-0 border-t-blue-800 border-r-transparent"} w-0 h-0 border-t-[10px] ${isMe ? "border-l-[10px]" : "border-r-[10px]"}`}></span>
            </div>
          </div>
        );
    };
    
    return (
      <>
        <Head>
          <title>Chatify</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
        </Head>
        <div className="bg-gray-900 h-screen overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-[url('https://raw.githubusercontent.com/sudoxv/xcdn/refs/heads/main/bg-dark.jpg')] bg-cover bg-center text-white p-4 flex justify-between items-center select-none">
            <div className="flex items-center">
              <img className="rounded-full h-9 w-9 mr-2" src="https://placehold.co/300x300?text=Avatar" />
              <span className="text-lg">Qira Group</span>
              <i className="fa fa-check-circle text-blue-500 ml-2"></i>
            </div>
            <div className="border-2 border-green-500 rounded-3xl flex items-center">
              <span className="text-white px-2">Assistant:</span>
              <span className="text-green-500 font-bold pr-2 animate-pulse">&#x25CF;</span>
            </div>
          </div>
          
          {/* Chat Log */}
          <div id="chat-log" ref={chatLogRef} className="flex-1 overflow-y-auto px-2 py-4 space-y-2 mb-24">
            {messages.map((msg, idx) => renderMessage(msg, idx))}
          </div>
          
          {/* Input */}
          <div className="fixed bottom-0 left-0 w-full p-3 bg-transparent">
            <div className="max-w-4xl mx-auto flex items-center">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ketik pesan..."
                rows={1}
                className="flex-1 resize-none overflow-y-auto bg-gray-700 text-white rounded-3xl px-4 py-2 mr-2 focus:outline-none"
                style={{ maxHeight: "8rem" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
                }}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-10 w-10 rounded-full flex items-center justify-center"
              >
                <i className="fa fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/js/all.min.js" />
      </>
    );
};

export default Chat;
