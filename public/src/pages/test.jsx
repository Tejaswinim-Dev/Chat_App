import { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiSmile, FiMenu, FiSearch, FiMoreVertical } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';

const TestChatApp = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey there! 👋', sender: 'them', time: '10:00 AM' },
    { id: 2, text: 'How are things going?', sender: 'them', time: '10:01 AM' },
    { id: 3, text: 'Pretty good! Just working on some new designs.', sender: 'me', time: '10:05 AM', status: 'read' },
    { id: 4, text: 'That sounds interesting. Can I see?', sender: 'them', time: '10:06 AM' },
    { id: 5, text: 'Sure, I\'ll send you some screenshots later today.', sender: 'me', time: '10:10 AM', status: 'sent' },
    { id: 6, text: 'Looking forward to it! 😄', sender: 'them', time: '10:11 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const conversations = [
    { id: 1, name: 'Alex Johnson', lastMessage: 'See you tomorrow!', time: '9:45 AM', unread: 0, online: true },
    { id: 2, name: 'Design Team', lastMessage: 'Sarah: Updated the assets', time: 'Yesterday', unread: 3, online: false },
    { id: 3, name: 'Marketing Group', lastMessage: 'Meeting at 3 PM', time: 'Yesterday', unread: 0, online: false },
    { id: 4, name: 'Mom', lastMessage: 'Call me when free', time: 'Wed', unread: 0, online: true },
    { id: 5, name: 'David Wilson', lastMessage: 'Thanks for the help!', time: 'Tue', unread: 0, online: false },
  ];

  const handleSend = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg z-20 absolute md:relative md:translate-x-0 transform transition-all duration-300 ease-in-out w-80 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full border-r border-gray-200">
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Messages</h1>
              <button 
                className="md:hidden text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <IoIosArrowBack size={24} />
              </button>
            </div>
            <div className="relative mt-4">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations"
                className="w-full py-2 pl-10 pr-4 rounded-lg bg-indigo-500 text-white placeholder-indigo-200 focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conversation => (
              <div 
                key={conversation.id}
                className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-semibold">
                    {conversation.name.charAt(0)}
                  </div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h2 className="font-semibold truncate">{conversation.name}</h2>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <span className="ml-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {conversation.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center">
          <button 
            className="md:hidden mr-4 text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-semibold">
              A
            </div>
            <div className="ml-3">
              <h2 className="font-semibold">Alex Johnson</h2>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <div className="ml-auto flex space-x-4">
            <FiSearch size={20} className="text-gray-600" />
            <FiMoreVertical size={20} className="text-gray-600" />
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-indigo-500 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  <div className={`flex items-center mt-1 text-xs ${message.sender === 'me' ? 'text-indigo-200' : 'text-gray-500'}`}>
                    <span>{message.time}</span>
                    {message.sender === 'me' && message.status === 'read' && (
                      <span className="ml-1">✓✓</span>
                    )}
                    {message.sender === 'me' && message.status === 'sent' && (
                      <span className="ml-1">✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center">
              <button className="text-gray-600 p-2 rounded-full hover:bg-gray-100">
                <FiPaperclip size={20} />
              </button>
              <button className="text-gray-600 p-2 rounded-full hover:bg-gray-100">
                <FiSmile size={20} />
              </button>
              <div className="flex-1 mx-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent resize-none"
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
};

export default TestChatApp;