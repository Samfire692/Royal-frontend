import React, { useState, useEffect } from 'react' // Added useEffect
import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaUser, FaBullhorn, FaDoorOpen, FaPlusSquare, FaFile, FaHome, FaUserPlus } from 'react-icons/fa'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export const TeachNavbar = () => {
  // ✅ Fixed useState syntax
  const [status, setStatus] = useState(null);
  const [club, setClub] = useState(null);
  const navigate = useNavigate();

  const checkClassTeacherStatus = async () => {
    // 1. Get the logged-in user's email from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 2. Check their status in your teachersignup table
      const { data, error } = await supabase
        .from('teachersignup')
        .select('class_teacher_status, club_name')
        .eq('email', user.email)
        .single();

      if (!error && data) {
        setStatus(data.class_teacher_status);
        setClub(data.club_name);
      }
    }

    const teacherProfile = localStorage.getItem("TeacherProfile");

    if(!teacherProfile){
      navigate("/teacherlogin")
    }
  };

  useEffect(() => {
    checkClassTeacherStatus();
  }, []);

  const LogOut = async()=> {
     localStorage.clear();

     navigate("/teacherlogin")
  }

  const linkClasses = ({ isActive }) => 
    `flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all overflow-hidden ` + 
    (isActive ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-blue-400')

  return (
    <div>
      <div className='lg:px-3 lg:pt-5'>
        <nav className='fixed h-screen lg:h-[93vh] lg:rounded-2xl bg-blue-500 p-2 w-[70vw] md:w-[40vw] lg:w-[5vw] lg:hover:w-[18vw] transition-all group flex flex-col items-center overflow-hidden' style={{zIndex:"1"}}>
          
          <div className='mb-10 mt-2'>
            <img src={schoolLogo} alt="logo" className='w-12 lg:w-[4vw] min-w-11.25px rounded-full' />
          </div>
    
          <div className='flex flex-col gap-4 w-full'>
            <NavLink to="/" className={linkClasses}>
              <FaHome className='text-2xl min-w-7.5px' />
              <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Home</span>
            </NavLink>
    
            <NavLink to="/teacher/profile" className={linkClasses}>
              <FaUser className='text-2xl min-w-7.5px' />
              <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Profile</span>
            </NavLink>
    
            <NavLink to="/teacher/insertResult" className={linkClasses}>
              <FaPlusSquare className='text-2xl min-w-7.5px' />
              <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Insert Result</span>
            </NavLink>

            {/* ✅ Only show Student's Result if status is 'approved' */}
            {status === 'approved' && (
              <NavLink to="/teacher/studentresult" className={linkClasses}>
                <FaFile className='text-2xl min-w-7.5px' />
                <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Student's Result</span>
              </NavLink>
            )}

            {club && (
              <NavLink to="/teacher/insertclub" className={linkClasses}>
                <FaFile className='text-2xl min-w-7.5px' />
                <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Insert Club</span>
              </NavLink>
            )}

             {status === 'approved' && (
              <NavLink to="/teacher/studentsignup" className={linkClasses}>
                <FaUserPlus className='text-2xl min-w-7.5px' />
                <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Student SignUp</span>
              </NavLink>
            )}
    
            <button className='flex items-center gap-3 w-full px-3 py-2 mt-20 text-red-100 hover:bg-red-600 rounded-lg transition-all' onClick={LogOut}>
              <FaDoorOpen className='text-2xl min-w-7.5px' />
              <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}