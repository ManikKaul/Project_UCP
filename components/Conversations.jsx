import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import Cookies from 'js-cookie';
import { useAppContext } from '../AppContext';
import io from 'socket.io-client';

const ConversationsComponent = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const { username, userId } = useAppContext();
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection when the component mounts
    socketRef.current = io('http://localhost:5000'); // Replace with your server URL

    return () => {
      // Clean up the socket connection when the component unmounts
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      // Join room when selectedConversation changes
      socketRef.current.emit('joinRoom', { roomId: selectedConversation });
    }
  }, [selectedConversation]);

  const sendMessage = (messageText) => {
    // Emit the message to the server when the send button is clicked
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', {
        conversationId: selectedConversation, // Include the conversationId
        message: {
          text: messageText,
          sender: userId, // Assuming userId is the sender's ID
        },
      });
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      // Listen for incoming messages
      socketRef.current.on('receiveMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      if (socketRef.current) {
        // Clean up the event listener when component unmounts
        socketRef.current.off('receiveMessage');
      }
    };
  }, []);

  useEffect(() => {
    // Fetch conversations when the component mounts
    const fetchConversations = async () => {
      const token = Cookies.get('token');
      try {
        const response = await axios.post('http://localhost:5000/chat/getConversations', { token });
        setConversations(response.data.conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  const handleConversationClick = async (conversationId) => {
    const token = Cookies.get('token');
    try {
      // Fetch messages for the selected conversation
      const response = await axios.post('http://localhost:5000/chat/getMessages', {
        conversationId,
        token,
      });

      setMessages(response.data.messages);
      setSelectedConversation(conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const renderConversations = () => (
    <div className="w-[30%] pr-4 border-r border-gray-300">
      <h2 className="text-2xl font-semibold mb-4">Your Conversations</h2>
      <ul className="list-disc ml-4 space-y-2">
        {conversations.map((c) => {
          const otherParticipant = c.participants.find(participant => participant.userId.username !== username);

          return (
            <ul
              key={c._id}
              className={`flex shadow-xl cursor-pointer p-2 ${selectedConversation === c._id ? 'bg-gray-200 w-[200px]' : ''}`}
              onClick={() => handleConversationClick(c._id)}
            >
              {otherParticipant && (
                <div className='flex '>
                  <img className=' flex w-10 rounded-md mr-2' src={otherParticipant.userId.dp} alt="Profile" />
                  <p className='flex mt-2'>{otherParticipant.userId.username}</p>
                </div>
              )}
            </ul>
          );
        })}
      </ul>
    </div>
  );

  const renderMessages = () => (
    <div className='flex-col shadow-xl'>
      <div className="w-[800px] h-[500px] overflow-scroll x flex flex-col">
        <div className="flex items-center justify-between bg-gray-200 p-4">
          <h2 className="text-2xl font-semibold">{`Messages for Conversation ${selectedConversation}`}</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
            New Message
          </button>
        </div>
        <div className="p-4 flex flex-col">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 ${message.sender.username === username ? 'text-left' : 'text-right'}`}
            >
              <strong>{message.sender.username}:</strong> {message.text}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center p-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 p-2 rounded-md mr-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.target.value);
              e.target.value = '';
            }
          }}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={() => {
            const inputElement = document.querySelector('input[type="text"]');
            sendMessage(inputElement.value);
            inputElement.value = '';
          }}
        >
          Send
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex w-[50%]">
      {renderConversations()}
      {selectedConversation ? renderMessages() : <p>Select a conversation to start chatting</p>}
    </div>
  );
};

export default ConversationsComponent;
