// Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  FiSend, FiPaperclip, FiSmile, FiMenu, FiSearch, FiMoreVertical, FiMic
} from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUserRoute, sendMessageRoute, getMessagesRoute, deleteMessagesRoute } from '../utils/APIRoutes';
import { io } from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';

const socketHost = "http://localhost:5000";

function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [listening, setListening] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = sessionStorage.getItem("chat-app-user");
      if (!storedUser) return navigate("/");
      const user = JSON.parse(storedUser);
      if (!user.isAvatarImageSet || !user.avatarImg) return navigate("/setAvatar");
      setCurrentUser(user);
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(socketHost);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
  if (socket.current) {
    socket.current.on("msg-receive", (msgData) => {

      // ✅ Fix: Only add message if it's from someone else
      if (currentChat && msgData.from === currentChat._id) {
        const incomingMsg = {
          id: Date.now(),
          text: msgData.message,
          sender: 'them',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setMessages((prev) => [...prev, incomingMsg]);
      }
    });
  }
}, [currentChat]);


  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        try {
          const { data } = await axios.get(allUserRoute, {
            params: { currentUserId: currentUser._id },
          });
          setContacts(data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      }
    };
    fetchContacts();
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChatChange = async (chat) => {
    setCurrentChat(chat);
    try {
      const response = await axios.post(getMessagesRoute, {
        from: currentUser._id,
        to: chat._id,
      });

      const msgs = response.data.map((msg) => ({
        id: msg._id || Date.now() + Math.random(),
        text: msg.message,
        sender: msg.fromSelf ? 'me' : 'them',
        time: msg.time,
      }));

      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleSend = async () => {
    if (newMessage.trim() === '' || !currentChat) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMsg]);

    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: newMessage,
    });

    try {
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: newMessage,
      });
    } catch (err) {
      console.error("Error saving message to DB:", err);
    }

    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

const handleDeleteMessages = async () => {
  if (!currentChat || !currentUser) return;

  const confirmDelete = window.confirm(
    `Delete all messages between you and ${currentChat.username}?`
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(deleteMessagesRoute, {
      params: {
        from: currentUser._id,
        to: currentChat._id,
      },
    });
    console.log(currentChat._id, currentUser._id);

    setMessages([]); // Clear chat on UI
    alert("Messages deleted successfully.");
  } catch (err) {
    console.error("Failed to delete messages:", err);
    alert("Error deleting messages.");
  }
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser does not support Speech Recognition");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setListening(false);
    };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setNewMessage((prev) => prev + ' ' + transcript);
    };

    recognition.start();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg z-20 absolute md:relative md:translate-x-0 transform transition-all duration-300 ease-in-out w-80 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full border-r border-gray-200">
          <div className="p-4 bg-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Messages</h1>
              <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
                <IoIosArrowBack size={24} />
              </button>
            </div>
            <div className="relative mt-4">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input type="text" placeholder="Search contacts" className="w-full py-2 pl-10 pr-4 rounded-lg bg-indigo-500 text-white placeholder-indigo-200 focus:outline-none focus:ring-1 focus:ring-white" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {contacts.map(contact => (
              <div key={contact._id} onClick={() => handleChatChange(contact)} className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                <img src={contact.avatarImg} alt="avatar" className="w-12 h-12 rounded-full" />
                <div className="ml-3 flex-1 min-w-0">
                  <h2 className="font-semibold truncate">{contact.username}</h2>
                  <p className="text-sm text-gray-500 truncate">Start a new conversation...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:ml-0">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center">
          <button className="md:hidden mr-4 text-gray-600" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={24} />
          </button>
          {currentChat && (
            <div className="flex items-center">
              <img src={currentChat.avatarImg} className="w-10 h-10 rounded-full" alt="chat avatar" />
              <div className="ml-3">
                <h2 className="font-semibold">{currentChat.username}</h2>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="Search messages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hidden md:block border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="relative">
              <button onClick={() => setShowOptions(prev => !prev)} className="text-gray-600 hover:text-gray-900">
                <FiMoreVertical size={20} />
              </button>
              {showOptions && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleDeleteMessages}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete Messages
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            {messages
              .filter((message) =>
                message.text.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(message => (
                <div key={message.id} className={`flex mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender === 'me' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none shadow-sm'}`}>
                    <p className="break-words">{message.text}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <span>{message.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-4 relative">
          <div className="max-w-3xl mx-auto">
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 z-40">
                <EmojiPicker
                  onEmojiClick={(emojiData) => setNewMessage(prev => prev + emojiData.emoji)}
                  theme="light"
                />
              </div>
            )}
            <div className="flex items-center">
              <button className="text-gray-600 p-2 rounded-full hover:bg-gray-100">
                <FiPaperclip size={20} />
              </button>
              <button className="text-gray-600 p-2 rounded-full hover:bg-gray-100" onClick={() => setShowEmojiPicker(prev => !prev)}>
                <FiSmile size={20} />
              </button>
              <button
                className={`text-gray-600 p-2 rounded-full hover:bg-gray-100 ${listening ? 'animate-pulse' : ''}`}
                onClick={startListening}
                title="Voice to Text"
              >
                <FiMic size={20} />
              </button>
              <div className="flex-1 mx-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  rows="1"
                  style={{ minHeight: '44px' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className={`p-3 rounded-full ${newMessage.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400'}`}
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;








