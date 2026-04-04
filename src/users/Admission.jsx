import React from 'react'
import { FaDesktop, FaMobile, FaFile } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'

export const Admission = () => {
const navigate = useNavigate();

const online =()=> {
  Swal.fire({
    imageUrl:schoolLogo,
    customClass: {
      popup: 'my-royal-popup' 
    },
    imageWidth:80,
    imageHeight:80,
    title:"Redirecting...",
    text:"Preparing your digital enrollment session. Excellence awaits.",
    showConfirmButton:false,
    allowOutsideClick: false,
    timer:5000
  })

  setTimeout(()=> {
    navigate('/admissionform')
  }, 5000)
}

  return (
    <div className='py-4 px-3'>
      <div className='py-3 mb-3'>
        <h2 className='text-2xl font-bold text-blue-800 mb-2'>Admission</h2>
        <p>“Complete the form below to start the admission process.”</p>
      </div>

      {/* form cards */}
     <section id='formCards'>
        <div className='formCards flex flex-col lg:flex-row gap-3'>
        {/* online cards */}
        <div className='shadow-2xl py-3 px-3 rounded-2xl'>
          <span className='flex gap-1 mb-3'><span className='text-4xl text-blue-800 lg:block hidden'><FaDesktop/></span><span className='text-4xl text-blue-800 lg:hidden'><FaMobile/></span><span className='my-auto  text-blue-900 font-bold'>Online Form</span></span>
          <p>“This online form is here to make the admission process simple and convenient for you. If you prefer, you’re welcome to visit our admissions office and submit your application in person. Either way, our team is ready to assist you and answer any questions along the way.”</p>
          <button className='p-2 rounded-xl bg-blue-700 text-white mt-3' onClick={online}>Online Form</button>
        </div>

        {/* offline cards */}
        <div className='shadow-2xl py-3 px-3 rounded-2xl'>
          <span className='flex mb-3 gap-1'><span className='text-4xl text-blue-800'><FaFile/></span><span className='my-auto text-blue-900 font-bold'>Offline Form</span></span>
          <p>“If you’d rather apply in person, our admissions office is open and happy to welcome you. You can complete and submit your application offline, and our friendly admissions team will be available to guide you through the process and answer any questions you may have.”</p>
          <button className='p-2 rounded-xl bg-blue-700 text-white mt-3'>Download Form</button>
        </div>

      </div>
     </section>
    </div>
  )
}


