import React from 'react'
import { Link, useLocation } from 'react-router-dom' // Added useLocation
import { useState } from 'react'
import { FaBars, FaStream, FaUser, FaPalette } from 'react-icons/fa'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'

export const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  const location = useLocation(); // This tells us where we are right now

  // Helper function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`container-fluid grid lg:flex my-0 pt-3 pb-1 px-1 lg:px-4 fixed w-screen md:px-4 lg:shadow lg:bg-white`} style={{zIndex:"100"}}>

      <div className={`flex justify-between mb-4 lg:mb-0 lg:bg-transparent px-3 py-2 rounded-4xl md:px-4 bg-blue-500`}>
        <img src={schoolLogo} alt="" className='rounded-full' style={{boxShadow:"1px 1px 15px royalblue"}} width={"75px"}/>
        <button className={`text-2xl text-white border-3 h-fit p-2 rounded-2xl my-auto lg:hidden ${!navbar?"border-slate-600":"border-slate-300 bg-blue-400"}`} onClick={()=> setNavbar(!navbar)}><FaBars /></button>
      </div>

      {/* desktop */}
      <div className='hidden lg:flex flex-col lg:flex-row gap-5 lg:mx-auto lg:my-auto text-lg'>
        <Link to="/" className={`${isActive('/') ? 'text-blue-900 font-bold border-b-2 border-blue-900' : 'text-blue-500'}`}>Home</Link>
        <Link to="/about" className={`${isActive('/about') ? 'text-blue-900 font-bold border-b-2 border-blue-900' : 'text-blue-500'}`}>About</Link>
        <Link to="/admission" className={`${isActive('/admission') ? 'text-blue-900 font-bold border-b-2 border-blue-900' : 'text-blue-500'}`}>Admission</Link>
        <Link to="/facilities" className={`${isActive('/facilities') ? 'text-blue-900 font-bold border-b-2 border-blue-900' : 'text-blue-500'}`}>Facilities</Link>
        <Link to="/news" className={`${isActive('/news') ? 'text-blue-900 font-bold border-b-2 border-blue-900' : 'text-blue-500'}`}>News</Link>
        <Link to="/events" className={`${isActive('/events') ? 'text-blue-900 font-bold border-b-2 border-blue-900' : 'text-blue-500'}`}>Events</Link>
        <Link to="/contacts" className={`${isActive('/contacts') ? 'text-blue-900 font-bold border-b-2 border-blue-900' : 'text-blue-500'}`}>Contacts</Link>
      </div>

      {/* mobile */}
      {navbar && (
        <div className={`flex flex-col gap-3 px-3 py-4 lg:mx-auto lg:my-auto text-white text-lg lg:hidden w-[72vw] h-[75vh] md:w-[43vw] md:h-fit rounded-4xl bg-blue-500`}>
          {/* On mobile, we change the background of the active link slightly so it pops */}
          <Link to="/" onClick={() => setNavbar(false)} className={`px-2 py-3 rounded-xl ${isActive('/') ? 'bg-white text-blue-600 font-bold' : ''}`}>Home</Link>
          <Link to="/about" onClick={() => setNavbar(false)} className={`px-2 py-3 rounded-xl ${isActive('/about') ? 'bg-white text-blue-600 font-bold' : ''}`}>About</Link>
          <Link to="/admission" onClick={() => setNavbar(false)} className={`px-2 py-3 rounded-xl ${isActive('/admission') ? 'bg-white text-blue-600 font-bold' : ''}`}>Admission</Link>
          <Link to="/facilities" onClick={() => setNavbar(false)} className={`px-2 py-3 rounded-xl ${isActive('/facilities') ? 'bg-white text-blue-600 font-bold' : ''}`}>Facilities</Link>
          <Link to="/news" onClick={() => setNavbar(false)} className={`px-2 py-3 rounded-xl ${isActive('/news') ? 'bg-white text-blue-600 font-bold' : ''}`}>News</Link>
          <Link to="/events" onClick={() => setNavbar(false)} className={`px-2 py-3 rounded-xl ${isActive('/events') ? 'bg-white text-blue-600 font-bold' : ''}`}>Events</Link>
          <Link to="/contacts" onClick={() => setNavbar(false)} className={`px-2 py-3 rounded-xl ${isActive('/contacts') ? 'bg-white text-blue-600 font-bold' : ''}`}>Contacts</Link>
        </div>
      )}
    </nav><br /><br /><br /><br />

      <div className='fixed bottom-10 right-3' style={{zIndex:100}}>
         <div className='mb-2 gap-2 flex flex-col place-items-end'>
          <Link to={"/role"} type="button" className='text-2xl shadow shadow-blue-600/60 p-4 lg:p-3 lg:w-12 rounded-full text-white bg-blue-500 cursor-pointer'><FaUser/></Link>
         </div>
      </div>
    </>
  )
}