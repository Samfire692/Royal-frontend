import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // We check local storage for the admin profile
  const adminSession = localStorage.getItem('adminProfile');

  // If no session, bounce them back to login immediately
  // 'replace' makes sure they can't hit the back button to return
  if (!adminSession) {
    return <Navigate to="/admin/" replace />;
  }

  // If session exists, show the requested page (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;