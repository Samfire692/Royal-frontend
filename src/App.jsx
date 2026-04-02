import { useState, useEffect} from 'react'
import { Navbar } from './users/Navbar'
import { Router } from './users/Router'
import { Footer } from './users/Footer'
import { Outlet } from 'react-router-dom';
import { AdminRouter } from './admin/AdminRouter';

function App() {
  return (
    <div className={`overflow-x-hidden`}>
      <Router/>
      <AdminRouter/>
      {/* <Footer/> */}
    </div>
  )
}

export default App
