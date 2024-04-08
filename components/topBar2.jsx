import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Profile from './Profile';

export default function TopBar2 ({ bgTopBar, bgTopBar2, onNight, text, updateTopbar2, nightMode, dm, notifications, bgactive }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dp, setDp] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // Initialize as null
  const [user, setUser] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    const baseURL = 'http://localhost:5000';

    async function fetchData() {
      try {
        const response = await axios.post(`${baseURL}/userData`, { token });
        setUsername(response.data.user.username);
        setFirstName(response.data.user.firstName);
        setLastName(response.data.user.lastName);
        setDp(response.data.user.dp);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchData();
  }, []);

  const handleProfileView = () => {
    // Open the profile details only when the user clicks on the profile picture
    setSelectedUser(dp);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  return (
    <div className={`flex justify-around 2xl:h-full 2xl:w-full overflow-hidden ${bgTopBar} `}>
      <div className='flex ml-32 h-full w-full items-center '>
        <h2 className='text-center mt-0.5 text-[15px] shadow-white text-slate-500 '>Hey, </h2>
        <h2 className={`flex text-[25px] w-[150px] ${text} mr-2 ml-2 `}> {firstName} {lastName}</h2>
        <img onClick={handleProfileView} className='hover:shadow-md hover:shadow-slate-600 cursor-pointer rounded-md object-contain h-10' src={dp} alt={username} />
        <div className='ml-5 -mt-7'>
          <div className='flex gap-2 items-center mt-10 ml-[550px] x 2xl:p-2'>
            <img onClick={() => { if (notifications) { updateTopbar2('notifications'); updateTopbar2('dm'); } else { updateTopbar2('dm') } }} className={`2xl:p-3 cursor-pointer h-12 ${nightMode ? 'invert' : ''} ${dm ? bgactive : 'hover:scale-110'} bg-opacity-20 rounded-md `} src='https://cdn-icons-png.flaticon.com/128/1380/1380338.png' alt="Dm" />
            <img onClick={() => { if (dm) { updateTopbar2('notifications'); updateTopbar2('dm'); } else { updateTopbar2('notifications') } }} className={` 2xl:p-3 h-12 cursor-pointer ${nightMode ? 'invert' : ''} ${notifications ? bgactive : 'hover:scale-110'} bg-opacity-20 rounded-md `} src='https://cdn-icons-png.flaticon.com/128/2097/2097743.png' alt="notifications" />
            <div onClick={onNight} className=' cursor-pointer 2xl:h-10 2xl:mt-0.5 2xl:ml-0.5 2xl:w-10 hover:bg-opacity-70 items-center flex justify-center bg-black bg-opacity-20 rounded-xl'>
              <DarkModeSwitch style={{}} checked={nightMode} onChange={onNight} size={20} />
            </div>
          </div>
          <div className='flex p-2  '>
            <div className=' overflow-visible'></div>
          </div>
          {selectedUser && (
            <div className='absolute'>
              <Profile user={user} onClose={closeUserDetails} />
            </div>
          )}
        </div>
      </div>
      {/* chats */}
      <div className={` ${dm ? 'block' : 'hidden'} 2xl:top-[70px] ml-2  rounded-md absolute 2xl:h-[600px] 2xl:w-[400px] ${bgTopBar2} `}></div>
      {/* notifications */}
      <div className={` ${notifications ? 'block' : 'hidden'} 2xl:top-[70px] ml-14  rounded-md absolute 2xl:h-[600px] 2xl:w-[400px] ${bgTopBar2} `}></div>
    </div>
  );
}
