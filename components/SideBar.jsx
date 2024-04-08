import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { useEffect } from 'react';

function SideBar() {
  const {
    bgSideBar,
    nightMode,
    bgactive,
    active,
    setActive,
    onNight,
  } = useAppContext();

  const location = useLocation();

  useEffect(() => {
    // Set active based on the current route
    const currentPath = location.pathname.substring(1); // Remove the leading '/'
    setActive(currentPath || 'home');
  }, [location.pathname, setActive]);

  return (
    <div className={`flex-col ${bgSideBar} flex justify-between 2xl:h-full 2xl:w-[5.4%] shadow-lg `}>
      <div className='flex p-4'>
        <Link to='/profile'>
          <img className='rounded-md cursor-pointer' src="https://i.pravatar.cc/300" alt='dp' />
        </Link>
      </div>

      <ul className='flex-col flex justify-start space-y-2 p-4'>
        <Link to='/home'>
          <li onClick={() => setActive('home')} className={` 2xl:p-[14px]  cursor-pointer ${nightMode ? 'invert' : ''} ${active === 'home' ? bgactive : 'hover:scale-110'} bg-opacity-20 rounded-xl`}>
            <img src='https://cdn-icons-png.flaticon.com/128/3884/3884324.png' alt="home"></img>
          </li>
        </Link>

        <Link to='/classes'>
          <li onClick={() => setActive('classes')} className={` 2xl:p-[14px]  cursor-pointer ${nightMode ? 'invert ' : ''} ${active === 'classes' ? bgactive : 'hover:scale-110'} bg-opacity-20 rounded-xl`}>
            <img src='https://cdn-icons-png.flaticon.com/128/3424/3424916.png' alt="Calender"></img>
          </li>
        </Link>

        <Link to='/chat'>
          <li onClick={() => setActive('chat')} className={` 2xl:p-[14px]  cursor-pointer ${nightMode ? 'invert ' : ''} ${active === 'chat' ? bgactive : ' hover:scale-110'} bg-opacity-20 rounded-xl`}>
            <img src='https://cdn-icons-png.flaticon.com/128/569/569412.png' alt="chat"></img>
          </li>
        </Link>

        <Link to='/meet'>
          <li onClick={() => setActive('meet')} className={` 2xl:p-[12px]  cursor-pointer ${nightMode ? 'invert' : ''} ${active === 'meet' ? bgactive : 'hover:scale-110'} bg-opacity-20 rounded-xl`}>
            <img src='https://cdn-icons-png.flaticon.com/128/10374/10374095.png' alt="Meet"></img>
          </li>
        </Link>
      </ul>

      <ul className=' flex-col space-y-4 p-4'>
        <Link to='/settings'>
          <li onClick={() => setActive('settings')} className={` 2xl:p-[14px] cursor-pointer ${nightMode ? 'invert' : ''} ${active === 'settings' ? bgactive : 'hover:scale-110'} bg-opacity-20 rounded-xl`}>
            <img src='https://cdn-icons-png.flaticon.com/128/2040/2040504.png' alt="Settings"></img>
          </li>
        </Link>

        <li onClick={() => setActive('logout')} className={`hidden 2xl:p-[14px]  cursor-pointer ${nightMode ? 'invert' : ''} ${active === 'logout' ? bgactive : 'hover:scale-110'} bg-opacity-20 rounded-xl`}>
          <img src='https://cdn-icons-png.flaticon.com/128/5637/5637831.png' alt="home"></img>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
