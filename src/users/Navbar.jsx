import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FaBars, FaStream, FaUser, FaPalette } from 'react-icons/fa'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'

export const Navbar = () => {
  const [navbar, setNavbar] = useState(false);
  const [themestate , setThemestate] = useState(localStorage.getItem('themes') || ('white'));
  const [thememode, setThememode] = useState(false)

  const themeclick = (color)=>{
    localStorage.setItem('themes', color);
    setThemestate(color);
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <>
      <nav className={`container-fluid grid lg:flex my-0 pt-3 pb-1 px-1 lg:px-4 fixed w-screen md:px-4 lg:shadow lg:bg-white`} style={{zIndex:"100"}}>

      <div className={`flex justify-between mb-4 lg:mb-0 lg:bg-transparent px-3 py-2 rounded-4xl md:px-4 bg-blue-500`}>

        <img src={schoolLogo} alt="" className='rounded-full' style={{boxShadow:"1px 1px 15px royalblue"}} width={"75px"}/>
        <button className={`text-2xl text-white border-3 h-fit p-2 rounded-2xl my-auto lg:hidden ${!navbar?"border-slate-600":"border-slate-300 bg-blue-400"}`} onClick={()=> setNavbar(!navbar)}><FaBars /></button>
      </div>

{/* desktop */}
      <div className='hidden lg:flex flex-col lg:flex-row gap-5 lg:mx-auto lg:my-auto text-lg text-blue-500'>
        <Link to="/">Home</Link>
        <Link to={"/about"}>About</Link>
        <Link to={"/admission"}>Admission</Link>
        <Link to={"/facilities"}>Facilities</Link>
        <Link to={"/news"}>News</Link>
        <Link to={"/events"}>Events</Link>
        <Link to={"/contacts"}>Contacts</Link>
      </div>

{/* mobile */}
     {navbar && (
        <div className={`flex flex-col gap-3 px-3 py-4 lg:mx-auto lg:my-auto text-white text-lg lg:hidden w-[72vw] h-[75vh] md:w-[43vw] md:h-fit rounded-4xl bg-blue-500`}>

          <Link to="/" className='px-2 py-3'>Home</Link>
          <Link to={"/about"} className='px-2 py-3 '>About</Link>
          <Link to={"/admission"} className='px-2 py-3 '>Admission</Link>
          <Link to={"/facilities"} className='px-2 py-3 '>Facilities</Link>
          <Link to={"/news"} className='px-2 py-3 '>News</Link>
          <Link to={"/events"} className='px-2 py-3 '>Events</Link>
          <Link to={"/contacts"} className='px-2 py-3 '>Contacts</Link>
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
