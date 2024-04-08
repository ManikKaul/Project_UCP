// ClassesComponent.jsx
import React, { useState,useEffect } from 'react';
import ClassDetailView from './ClassDetailView';
import Cookies from 'js-cookie';
import axios from 'axios';

const ClassesComponent = ({ userClasses, onCreateClass,bgtext,userType }) => {
  const [newClassName, setNewClassName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Define an asynchronous function
    const fetchData = async () => {
      const token = Cookies.get('token');
      const baseUrl = 'http://localhost:5000';
      try {
        const response = await axios.post(`${baseUrl}/class/get-classes`, { token });
        console.log(response.data);
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
  
    // Call the asynchronous function
    fetchData();
  }, []);
  
  const handleClassClick = (classId) => {
    setSelectedClass(classId);
  };

  const handleCreateClass = async () => {
    const token = Cookies.get('token');
    const baseUrl = 'http://localhost:5000';

    try {
      // Make a POST request to create a new class
      const response = await axios.post(`${baseUrl}/class/create-class`, {
        token,
        name: newClassName,
        picture : 'https://picsum.photos/200' // Assuming 'newClassName' is the input for the new class name
      });

      // Update the classes state with the new data
      setClasses([...classes, response.data]);

      // Optionally, you can trigger any additional logic on class creation
      if (onCreateClass) {
        onCreateClass(response.data);
      }

      // Clear the input field after creating the class
      setNewClassName('');
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };
  return (
    <div className="mt-8  p-4 flex">
      {/* Your Classes */}
      <div className={`${selectedClass ? 'shadow-xl p-5 shadow-slate-400 [h-550px] x overflow-scroll m-2 h-[600px] w-[200px] ml-[1200px] -mt-10 ' : 'relative'}`}>
        <div className={`w-full ${selectedClass ? '' : ''} pr-4`}>
          <h2 className={`text-2xl font-semibold ${bgtext}  mb-4`}>Your Classes</h2>
          <div className={`${selectedClass ? 'flex-col' : 'flex'} gap-2 flex-wrap`}>
          {classes && classes.map((userClass) => (
              <div
                key={userClass.id}
                className={`mb-4 flex cursor-pointer w-32 h-32 relative ${
                  selectedClass === userClass.id ? 'right-0 shadow-xl scale-110 m-2 shadow-slate-800' : ''
                }`}
                onClick={() => handleClassClick(userClass._id)}
              >
                <img
                  src={userClass.picture}
                  alt={`${userClass.name} Image`}
                  className="w-full h-full flex object-cover rounded-md"
                />
                <div className="absolute inset-0 flex bg-black opacity-30 rounded-md"></div>
                <p className="absolute inset-0  flex items-center justify-center text-white text-sm font-semibold">
                  {userClass.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create a New Class */}
      <div className={` w-1/3 ${selectedClass && 'hidden'}`}>
        <h2 className={`text-2xl font-semibold mb-4 ${bgtext}`}>Create a New Class</h2>
        <div className={`flex items-center ${userType ==='teacher' || userType === 'admin'?'block':'hidden'} space-x-4`}>
          <input
            type="text"
            placeholder="Enter Class Name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-64 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleCreateClass}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Create Class
          </button>
        </div>
      </div>
       {/* Display Class Detail View */}
       {selectedClass && (
  <ClassDetailView
    classId={selectedClass}
    className={classes.find((c) => c._id === selectedClass)?.name || ''}
    teacherName={classes.find((c) => c._id === selectedClass)?.teacher || ''}
    subjectImage={classes.find((c) => c._id === selectedClass)?.picture || ''}
    textCalender={bgtext}
  />
)}

    </div>
  );
};

export default ClassesComponent;
