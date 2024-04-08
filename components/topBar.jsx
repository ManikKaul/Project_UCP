import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Miet from '../assets/Miet.png'
import { useAppContext } from '../AppContext';


export default function TopBar({bgTopBar, Active}){
  const {
    nightMode,
   
  } = useAppContext();

  return(
   
    <div className={`flex justify-between 2xl:h-full 2xl:w-[30%] ${bgTopBar} `}>
   <Link to='/home'><img className={`h-[40px]  m-2  w-[130px] ${nightMode ? '':'invert '}`} src={Miet} width={70} alt='home' /></Link>
    {console.log(Active)}
    
    <div className={`flex ${Active === 'home' ? 'block':'hidden'} h-full gap-2 overflow-x-auto w-[60%] ${bgTopBar} x p-2 `}>
     
    </div>


    </div>
 
  )  
}