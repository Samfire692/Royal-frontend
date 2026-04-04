import React from 'react'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'
import passportpic from '../assets/Images/admin profile pic.jfif'

export const AdmissionForm = () => {
  return (
    <div className='h-screen bg-slate-400 p-2'>
        <section id='form'>
          <div className='form flex justify-center'>
            <form action="" className='p-3 border rounded-xl'>
              <div className='text-center flex gap-3'>
                <img src={schoolLogo} alt="" width={'80px'} className='rounded-full' style={{boxShadow:'1px 1px 15px blue'}}/>
                <h2 className='font-bold text-2xl my-auto'>ROYAL AMBASSADORS SCHOOLS</h2>
                
              </div><br />

            <div className='flex flex-col lg:flex-row-reverse gap-2'>
              <div className='addImg border w-fit p-1 rounded-xl m-auto h-fit'>
                <img src={passportpic} alt="" width={'150px'} className='rounded-xl'/>
              </div>

              <div className='px-2 my-auto'>
               <div className='mb-1'>
                <label htmlFor="" className='font-bold'>Surname:</label>
                <input type="text" className='border w-full h-8'/>
               </div>

               <div className='mb-1'>
                <label htmlFor="" className='font-bold'>First Name:</label>
                <input type="text" className='border w-full h-8'/>
               </div>

               <div className='mb-1'>
                <label htmlFor="" className='font-bold'>Middle Name:</label>
                <input type="text" className='border w-full h-8'/>
               </div>
             </div>

            </div>

            </form>
          </div>

        </section>
    </div>
  )
}
