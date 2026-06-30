import React from 'react'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className='h-[80vh] flex justify-center place-items-center'>
      <div className='text-center'>
         <h1 className='text-4xl font-bold'>404</h1>
         <h2 className='my-2 text-xl'>Oops! Page not found.</h2>
         <p className='mb-1'>The page you are looking for might have been removed or is temporarily unavailable.</p>
         <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
         Back to Home page
         </Link>
      </div>
    </div>
  )
}
