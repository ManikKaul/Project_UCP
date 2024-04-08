import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie'; // Import the default export


export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    department:'',
    semester:'',
    confirmPassword:'',
    usernameOrEmail:'',
    type: "", 
  });
  

  const [responseMessage, setResponseMessage] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "password" || name === "confirmPassword") {
      // Check if passwords match
      if (formData.password === formData.confirmPassword) {
        // Passwords match, store the value in formData.password
        setFormData({
          ...formData,
          password: value,
        });
        setPasswordMatch(true);
      } else {
        setPasswordMatch(false);
      }
    }
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseURL = 'http://localhost:5000';

    if (activeTab === 'login') {
      // Handle login form submission
      try {
        const response = await axios.post(`${baseURL}/login`, formData);
        // Assuming the server responds with a token
      const { token } = response.data;
   const cookie = new Cookies()
      // Store the token in a cookie
      cookie.set('token', token);
        navigate('/home');
        // Handle response as needed
      } catch (error) {
        console.error(error);
        // Handle error as needed
      }
    } else {
      if (formData.password === formData.confirmPassword) {
        // Handle signup form submission
        try {
          console.log('formdataaaaa',formData);
          const response = await axios.post(`${baseURL}/signup`, formData);
          const { token } = response.data;
          const cookie = new Cookies()
             // Store the token in a cookie
             cookie.set('token', token);
               navigate('/home');
          // Handle response as needed
        } catch (error) {
          console.error(error);
          // Handle error as needed
        }
      }
    }
  };
  const verifySession = async () => {
    const baseURL = 'http://localhost:5000'; 
    const cookie = new Cookies()
    // Store the token in a cookie
   const token = cookie.get('token');
  
    try {
      const response = await axios.post(`${baseURL}/verify`, {token});
      const { valid, user } = response.data;
      console.log(response.data)

      if (valid) {
        // Session is valid, you can use the user data
        navigate('/home')
      } 
    } catch (error) {
      // Handle errors
      console.error('Error verifying session:', error);
    }
  };
useEffect(() => {
  verifySession();
}, []);
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200">
      <div className={`bg-white p-8 shadow-md rounded-md ${activeTab === "login" ? "w-[400px] h-[360px]" : "w-[500px] h-[530px]"}`}>
        <div className="flex justify-center mb-4">
          <button
            className={`py-2 px-4 ${activeTab === "login"
              ? "bg-pink-500 text-white"
              : "bg-gray-300 text-gray-600"
            } rounded-tl-md rounded-bl-md`}
            onClick={() => handleTabChange("login")}
          >
            Login
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "signup"
              ? "bg-pink-500 text-white"
              : "bg-gray-300 text-gray-600"
            } rounded-tr-md rounded-br-md`}
            onClick={() => handleTabChange("signup")}
          >
            Sign Up
          </button>
        </div>

        {responseMessage && (
          <p className="text-center text-green-500 mb-4">{responseMessage}</p>
        )}

        {activeTab === "login" ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-8 mt-10">
              <input
                type="text"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleInputChange}
                className="appearance-none border mb-4 rounded text-sm w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="username / Email"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none border text-sm rounded w-full py-2 h-12 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="appearance-none border rounded mt-5 mb-4 w-[45%] py-2 px-3 mr-5 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Name"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="appearance-none border rounded mt-5 mb-4 w-[45%] py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Last Name"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="appearance-none border rounded mb-4 w-[60%] py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Email"
              required
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="appearance-none border rounded mb-4 mr-5 w-[60%] py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Username"
              required
            />
<input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="appearance-none border rounded mb-4 mr-5 w-[45%] py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Deaprtment"
              required
            />
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              className="appearance-none border rounded mb-4 mr-5 w-[45%] py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Semester"
              
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`appearance-none border ${passwordMatch ? "" : "border border-red-500"} rounded mb-4 mr-5 w-[45%] py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Password"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`appearance-none border ${passwordMatch ? "" : "border border-red-500"} rounded mb-6 w-[45%] py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline`}
              placeholder="Confirm Password"
              required
            />
<select
  name="type"
  value={formData.type}
  onChange={handleInputChange}
  className="appearance-none border rounded mb-4 w-[60%] py-2 px-3 text-gray-700 text-sm leading-tight placeholder-gray-300 focus:outline-none focus:shadow-outline"
  required
>
  <option value="" className='text-slate-300' disabled>Select User Type</option>
  <option value="student">Student</option>
  <option value="teacher">Teacher</option>
  <option value="admin">Admin</option>
</select>

            <br></br>
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-700 text-white mt-5 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
