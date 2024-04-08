import React from 'react'

const Profile = ({user ,onClose}) => {
  return (
    <div className="fixed mt-16 mr-10 top-0 right-0 h-[650px] w-[400px] bg-white bg-opacity-90 shadow-2xl shadow-slate-700 overflow-y-auto x">
    <div onClick={onClose} className="text-md text-center font-bold text-slate-200 cursor-pointer h-6 w-14 shadow-slate-100 bg-slate-700 shadow-2xl hover:bg-gray-700 absolute top-2 right-2">
      Close
    </div>
    <div className="flex flex-col items-center">
      <img src={user.dp} alt={`${user.username}'s profile`} className="w-full h-full" />

      <h2 className="text-xl mt-2 font-semibold mb-2"><span className='text-sm font-normal'>Userame:</span> {user.username}</h2>
      
      <div className="text-slate-600 mb-2">
        <p>{` ${user.type || 'N/A'}`}</p>

        <p className='-ml-20 shadow-lg' >{`Full Name: ${user.firstName || 'Sahil'} ${user.LastName || 'Sharma'}`}</p>
        <p className='-ml-20'>{`Semester: ${user.semester || 'N/A'}`}</p>
        <p className='-ml-20'>{`Department: ${user.department || 'N/A'}`}</p>
        
                      </div>
      {/* Add other user details here */}
    </div>
  </div>
);
};


export default Profile