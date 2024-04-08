import React, { createContext, useContext, useState,useEffect } from 'react';
import Cookies from 'js-cookie'

import axios from 'axios';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppContextProvider({ children }) {
  const [nightMode, setNightMode] = useState(false);
  const [active, setActive] = useState('home');
  const [topbar2, setTopbar2] = useState({ dm: false, notifications: false });
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dp, setDp] = useState('');
  const [userId, setUserId] = useState('');
  const [semester, setSemester] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [userType , setUserType] = useState('');



  useEffect(() => {
    const token = Cookies.get('token');
    const baseURL = 'http://localhost:5000';

    // Use an async function to make the API request
    async function fetchData() {
      try {
        const response = await axios.post(`${baseURL}/userData`, { token });
        const userData = response.data; // Assuming the response data contains user information
       
        // Update the state with the user data
        setUsername(response.data.user.username);
        setFirstName(response.data.user.firstName);
        setLastName(response.data.user.lastName);
        setDp(response.data.user.pic);
        setUserId(response.data.user._id)
        setDepartment(response.data.user.department);
        setSemester(response.data.user.semester);
        setEmail(response.data.user.Email);
        setUserType(response.data.user.type);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchData(); // Call the async function to fetch and update user data

  }, []);
  const updatetopbar2 = (fieldName) => {
    setTopbar2((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
      
    }));
  };

  const onNight = () => {
    setNightMode(!nightMode);
  };

  const bgprimary = nightMode ? 'bg-slate-700' : 'bg-slate-100';
  const bgTopBar2 = nightMode ? 'bg-slate-800' : 'bg-slate-200';
  const bgTopBar = nightMode ? 'bg-slate-800' : 'bg-slate-200';

  const bgSideBar = nightMode ? 'bg-blue-900' : 'bg-blue-400';
  const bgMain = nightMode ? 'bg-slate-600' : 'bg-slate-300';
  const bgactive = nightMode ? 'bg-gray-100' : 'bg-gray-900';
  const bgBottombar = nightMode ? 'bg-fuchsia-800' : 'bg-fuchsia-400';
  const textCalender = nightMode ? 'text-slate-200' : 'text-slate-700';

  const sharedState = {
    nightMode,
    active,
    topbar2,
    bgprimary,
    bgTopBar,
    bgSideBar,
    bgMain,
    bgactive,
    bgTopBar2,
    email,
    department,
    semester,
    bgBottombar,
    textCalender,
    updatetopbar2,
    onNight,
    setActive,
    userType,
username,
firstName,
lastName,
dp,
userId,
  };

  return <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>;
}
