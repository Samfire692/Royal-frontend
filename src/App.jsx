import { useState, useEffect} from 'react'
import { Navbar } from './users/Navbar'
import { Router } from './users/Router'
import { Footer } from './users/Footer'
import { Outlet } from 'react-router-dom';
import { AdminRouter } from './admin/AdminRouter';

function App() {
 const [themestate , setThemestate] = useState(localStorage.getItem('themes') || ('white'));
 
 useEffect(()=> {
  const themechange =()=> {
    const currentTheme = localStorage.getItem('themes')
    setThemestate(currentTheme);
  }

  window.addEventListener('storage', themechange)
  return ()=> window.removeEventListener("storage", themechange)
 }, [])

  return (
    <div className={` overflow-x-hidden ${
      themestate === 'dark' ? " bg-slate-900  text-white" :
      themestate === 'royal' ? "bg-blue-400 text-white" :
      themestate === 'golden' ? "bg-orange-200 text-orange-950":
      themestate === 'royalty' ? "bg-purple-200 text-purple-950 " : "bg-white" 
    }`}>
      <Router/>
      <AdminRouter/>
      {/* <Footer/> */}
    </div>
  )
}

export default App
