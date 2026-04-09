import { useState, useEffect} from 'react'
import { Navbar } from './users/Navbar'
import { Router } from './users/Router'
import { Footer } from './users/Footer'
import { Outlet } from 'react-router-dom';
import { AdminRouter } from './admin/AdminRouter';
import { StudentRouter } from './Students/StudentRouter';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useLocation } from 'react-router-dom';

function App() {

  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 500); 

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className={`overflow-x-hidden`}>
      <Router/>
      <AdminRouter/>
      <StudentRouter/>
      {/* <Footer/> */}
    </div>
  )
}

export default App
