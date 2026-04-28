import { Routes, Route } from 'react-router-dom'
import { Router } from './users/Router'
import { AdminRouter } from './admin/AdminRouter'
import { StudentRouter } from './Students/StudentRouter'

function App() {
  return (
    <Routes>
      {/* user routes */}
      <Route path="/*" element={<Router />} />

      {/* admin routes */}
      <Route path="/admin/*" element={<AdminRouter />} />

      {/* student routes */}
      <Route path="/student/*" element={<StudentRouter />} />
    </Routes>
  )
}