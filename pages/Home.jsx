
import SideBar from '../components/SideBar';
import TopBar from '../components/topBar';
import TopBar2 from '../components/topBar2';
import { useAppContext } from '../AppContext';
import Miet from '../assets/M2.mp4'
// import MidSection from './components/midSection';

function Home() {
 
        const {
          nightMode,
          active,
          topbar2,
          bgprimary,
          bgTopBar,
          bgTopBar2,
          bgSideBar,
          bgMain,
          bgactive,
          bgBottombar,
          textCalender,
          updatetopbar2,
          onNight,
          setActive,
          username,
        } = useAppContext();

  return (
    <div className={`flex h-screen w-screen  overflow-hidden`}>
      {/* left  */}

      <div className={`flex 2xl:h-full 2xl:w-full ${bgprimary}`}>

        <div className={`flex-col 2xl:h-full 2xl:w-full `}>

          {/* topbar  */}
          <div className='flex 2xl:h-[8%] 2xl:w-full'>
     <TopBar bgTopBar={bgTopBar} Active={active}/>
     <TopBar2 bgTopBar2={bgTopBar2} bgTopBar={bgTopBar} text={textCalender} updateTopbar2={updatetopbar2} onNight={onNight} dm={topbar2.dm} notifications={topbar2.notifications} nightMode={nightMode} bgactive={bgactive} active={active} setActive={setActive} /> 

</div>
          {/* middle section sidebar plus mid  */}
          <div className='flex 2xl:h-[84%] 2xl:w-screen'>

            {/* sideBar  */}
            <SideBar bgSideBar={bgSideBar} nightMode={nightMode} bgactive={bgactive} active={active} setActive={setActive} onNight={onNight}/>
            
            {/* mid section      */}

            <div className={`flex 2xl:h-full 2xl:w-full justify-between  ${bgprimary} `}>

              
          <video  className='w-[1800px]  object-cover ' src={Miet} autoPlay loop muted />
            </div>

          </div>
          {/* bottom bar           */}
          <div className={`flex-col 2xl:h-full ${bgBottombar} 2xl:w-full `}>
 
 </div>
<div className='flex 2xl:h-[8%] 2xl:w-full'>

</div>
        </div>
      </div>

      {/* right */}
      <div className='flex-col 2xl:h-full 2xl:w-[30%]'>

      {/* topbar2 */}
      {/* <TopBar2 bgTopBar={bgprimary} updateTopbar2={updatetopbar2} onNight={onNight} dm={topbar2.dm} notifications={topbar2.notifications} nightMode={nightMode} bgactive={bgactive} active={active} setActive={setActive}/> */}
      
      {/* right section  */}
      <div className={`${topbar2.dm?'block':'hidden'} flex 2xl:h-[92%] 2xl:w-[460px] ${bgMain}`}></div>
      <div className={`${topbar2.notifications?'block':'hidden'} flex 2xl:h-[92%] 2xl:w-[460px] ${bgMain}`}></div>


      </div>

    </div>
  );
}

export default Home;
