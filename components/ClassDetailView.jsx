import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../AppContext';
import Cookie from 'js-cookie';

const ClassDetailView = ({ classId, className, teacherName, subjectImage, textCalender }) => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [url, setUrl] = useState('');
  const { userType, userId } = useAppContext();
  const [content, setContent] = useState([]);
  const [heading, setHeading] = useState('');
  const [fileName, setFileName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [discussion, setDiscussion] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Fetch announcements if the 'announcements' tab is clicked
    if (tab === 'announcements') {
      fetchAnnouncements();
    }
    if (tab === 'content') {
      fetchContent();
    }
    if (tab === 'discussion') {
      fetchDiscussion();
    }
  };

  const fetchAnnouncements = async () => {
    const baseUrl = 'http://localhost:5000'; // Replace with your backend URL
    try {
      const response = await axios.post(`${baseUrl}/class/get-announcements`, {
        classId,
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const createAnnouncement = async () => {
    const baseUrl = 'http://localhost:5000'; // Replace with your backend URL
    try {
      await axios.post(`${baseUrl}/class/create-announcement`, {
        classId,
        content: newAnnouncement,
        url: url,
        type: 'image',
      });
      fetchAnnouncements();
      setNewAnnouncement('');
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleCreateContent = async () => {
    const token = Cookie.get('token');
    try {
      if (!heading || !fileName || !filePath) {
        console.error('Please fill in all fields');
        return;
      }

      const response = await axios.post('http://localhost:5000/class/create-content', {
        classId,
        heading,
        fileName,
        filePath,
        token,
      });
      fetchContent();
      setHeading('');
      setFileName('');
      setFilePath('');
      console.log('Class content created successfully');
    } catch (error) {
      console.error('Error creating class content:', error);
    }
  };

  const fetchContent = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/class/get-content`, {
        classId,
      });
      setContent(response.data);
      console.log('Content fetched successfully');
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchDiscussion = async () => {
    const token =Cookie.get('token');
    try {
      const response = await axios.post(`http://localhost:5000/class/get-discussions`, {
        classId,
        token,
      });
      setDiscussion(response.data);
      console.log('Discussion fetched successfully');
    } catch (error) {
      console.error('Error fetching discussion:', error);
    }
  };

  const createDiscussionMessage = async () => {
    const baseUrl = 'http://localhost:5000'; // Replace with your backend URL
    const token = Cookie.get('token');
    try {
      await axios.post(`${baseUrl}/class/send-discussion`, {
        classId,
        message: newMessage,
        sender: userId,
        token,
      });
      fetchDiscussion();
      setNewMessage('');
    } catch (error) {
      console.error('Error creating discussion message:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'announcements':
        return (
          <>
            <div className='flex-col h-[500px] overflow-scroll x'>
              {announcements.map((announcement) => (
                <div className='p-4 flex' key={announcement.id}>
                  <img src={announcement.url} alt={announcement.content} />
                  <p className='flex ml-10'>{announcement.content}</p>
                </div>
              ))}
            </div>

            {userType === 'teacher' && (
              <div className='flex h-8 gap-2 w-40 m-2  shadow-md'>
                <input
                  type="text"
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  placeholder="Enter announcement text"
                />
                <input
                  className='shadow-md'
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter Url"
                />
                <button
                  className=' flex bg-blue-400 rounded-md w-[100px] p-2 hover:bg-blue-500 text-sm  text-center '
                  onClick={createAnnouncement}
                >
                  create
                </button>
              </div>
            )}
          </>
        );

      case 'content':
        return (
          <>
            <div className={` ${userType === 'admin' || 'teacher' ? 'h-[300px]' : 'h-[500px]'} x  overflow-scroll`}>
              {content.map((contentItem) => (
                <div className='flex-col p-4 align-middle ' key={contentItem.id}>
                  <p className={`flex w-auto ${textCalender} shadow-md `}><strong>{contentItem.heading}</strong></p>
                  <p className={`flex ${textCalender} `} >{contentItem.fileName}</p>
                </div>
              ))}
            </div>
            <div className='p-4'>
              <h2 className='mb-2  font-bold'> Create Class Content</h2>
              <form>
                <label className={`${textCalender} `}>
                  Heading:
                  <input className='mb-2 ml-2' type="text" value={heading} onChange={(e) => setHeading(e.target.value)} />
                </label>
                <br />
                <label className={`${textCalender}`}>
                  File Name:
                  <input className='mb-2 ml-2' type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
                </label>
                <br />
                <label className={`${textCalender}`}>
                  File Path:
                  <input className='mb-2 ml-2' type="text" value={filePath} onChange={(e) => setFilePath(e.target.value)} />
                </label>
                <br />
                <button
                  className='bg-blue-400 rounded-md p-2 hover:bg-blue-500'
                  type="button"
                  onClick={handleCreateContent}
                >
                  Create Content
                </button>
              </form>
            </div>
          </>
        );

      case 'discussion':
        return (
          <>
            <div className={` ${userType === 'admin' || 'teacher' ? 'h-[300px]' : 'h-[500px]'} x overflow-scroll`}>
              {discussion.map((message) => (
                <div className='flex-col p-4 align-middle ' key={message.id}>
                  <p className={`flex w-auto ${textCalender} shadow-md `}><strong>{message.senderName}</strong></p>
                  <p className={`flex ${textCalender} `} >{message.message}</p>
                </div>
              ))}
            </div>
            {userType === 'teacher' && (
              <div className='p-4'>
                <h2 className='mb-2  font-bold'> Send Discussion Message</h2>
                <form>
                  <label className={`${textCalender} `}>
                    Message:
                    <input className='mb-2 ml-2' type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  </label>
                  <br />
                  <button
                    className='bg-blue-400 rounded-md p-2 hover:bg-blue-500'
                    type="button"
                    onClick={createDiscussionMessage}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute flex h-[550px] w-[1150px] ">
      {/* Left Section */}
      <div className='flex-col shadow-lg shadow-slate-400 w-[185px]'>
        <div className="w-[30%]cflex  h-[30%] pr-4">
          <img src={subjectImage} width={150} alt={`${className} Image`} className="w-[150px] m-4 items-center h-[150px] rounded-md" />
          <h2 className="text-lg font-semibold mt-4 text-center ">{className}</h2>
          <p className="text-sm text-gray-600 text-center">{teacherName}</p>
          <hr className="my-4" />
        </div>

        <div className="w-[30%] h-[50%] mt-20 flex ml-4">
          {/* Tabs */}
          <div className="flex flex-col">
            <div
              onClick={() => handleTabClick('announcements')}
              className={`cursor-pointer px-2 py-1 mb-2 ${
                activeTab === 'announcements' ? 'border-l-2 border-blue-500' : ''
              }`}
            >
              Announcements
            </div>
            <div
              onClick={() => handleTabClick('content')}
              className={`cursor-pointer px-2 py-1 mb-2 ${
                activeTab === 'content' ? 'border-l-2 border-blue-500' : ''
              }`}
            >
              Content
            </div>
            <div
              onClick={() => handleTabClick('discussion')}
              className={`cursor-pointer px-2 py-1 ${
                activeTab === 'discussion' ? 'border-l-2 border-blue-500' : ''
              }`}
            >
              Discussion
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-[60%] x overflow-scroll ml-4 shadow-xl shadow-slate-400">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ClassDetailView;
