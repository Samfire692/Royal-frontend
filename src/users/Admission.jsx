import React from 'react'
import { FaDesktop, FaMobile, FaFile, FaInfoCircle } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'

export const Admission = () => {
  const navigate = useNavigate();

  const online = () => {
    Swal.fire({
      imageUrl: schoolLogo,
      customClass: {
        popup: 'my-royal-popup'
      },
      imageWidth: 80,
      imageHeight: 80,
      title: "Redirecting...",
      text: "Preparing your digital enrollment session. Excellence awaits.",
      showConfirmButton: false,
      allowOutsideClick: false,
      timer: 5000
    })

    setTimeout(() => {
      navigate('/admissionform')
    }, 5000)
  }

  return (
    <div className='py-12 px-4 md:px-10 lg:px-20 bg-white'>
      {/* Header Section */}
      <div className='mb-10 text-center lg:text-left'>
        <h2 className='text-4xl font-black text-blue-900 mb-4 uppercase tracking-tighter'>Admission</h2>
        <div className='w-20 h-1.5 bg-blue-600 rounded-full mb-6 mx-auto lg:mx-0'></div>
        <p className='text-slate-600 italic font-medium'>
          “Complete the form below to start the admission process.”
        </p>
      </div>

      {/* Form Cards Section */}
      <section id='formCards'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto'>
          
          {/* Online Form Card */}
          <div className='flex flex-col bg-white shadow-2xl shadow-blue-900/10 p-8 rounded-[2.5rem] border border-slate-100 transition-transform hover:-translate-y-1 duration-300'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='text-4xl text-blue-800 p-4 bg-blue-50 rounded-2xl'>
                <span className='lg:block hidden'><FaDesktop /></span>
                <span className='lg:hidden'><FaMobile /></span>
              </div>
              <h3 className='text-2xl font-black text-blue-900 uppercase'>Online Form</h3>
            </div>
            
            <p className='text-slate-600 leading-relaxed mb-6'>
              “This online form is here to make the admission process simple and convenient for you. If you prefer, you’re welcome to visit our admissions office and submit your application in person.”
            </p>

            <div className='mt-auto bg-slate-50 p-5 rounded-2xl border-l-4 border-blue-600'>
              <p className='text-sm text-slate-700'>
                <span className='font-black text-blue-800 flex items-center gap-1 mb-1'>
                  <FaInfoCircle/> NOTE
                </span> 
                "Please upload a clear, recent passport-sized photograph. The background must be plain white."
              </p>
            </div>
            
            <button 
              className='w-full py-4 rounded-2xl bg-blue-700 text-white font-black mt-8 hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 uppercase tracking-widest' 
              onClick={online}
            >
              Start Online Application
            </button>
          </div>

          {/* Offline Form Card */}
          <div className='flex flex-col bg-white shadow-2xl shadow-blue-900/10 p-8 rounded-[2.5rem] border border-slate-100 transition-transform hover:-translate-y-1 duration-300'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='text-4xl text-blue-800 p-4 bg-blue-50 rounded-2xl'>
                <FaFile />
              </div>
              <h3 className='text-2xl font-black text-blue-900 uppercase'>Offline Form</h3>
            </div>
            
            <p className='text-slate-600 leading-relaxed mb-6'>
              “If you’d rather apply in person, our admissions office is open and happy to welcome you. Our friendly admissions team will be available to guide you through the process.”
            </p>

            <div className='mt-auto bg-slate-50 p-5 rounded-2xl border-l-4 border-blue-600'>
              <p className='text-sm text-slate-700'>
                <span className='font-black text-blue-800 flex items-center gap-1 mb-1'>
                  <FaInfoCircle/> NOTE
                </span> 
                "Hard copy submissions must be signed by the Guardian and accompanied by the original Birth Certificate."
              </p>
            </div>
            
            <button className='w-full py-4 rounded-2xl bg-blue-700 text-white font-black mt-8 hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 uppercase tracking-widest'>
              Download Hard Copy
            </button>
          </div>

        </div>
      </section>
    </div>
  )
}