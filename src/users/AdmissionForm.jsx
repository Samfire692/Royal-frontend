import React from 'react'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'
import passportpic from '../assets/Images/admin profile pic.jfif'

export const AdmissionForm = () => {
  return (
    <div className='p-2 bg-blue-400 text-white'>
        <div className='text-center py-2 mb-2'>
            <h2 className='font-bold text-3xl'>Admission Form</h2>
        </div>

        <section id='form'>
          <div className='form flex justify-center'>
            <form action="" className='p-3 border rounded-xl'>
              <div className='text-center flex gap-3'>
                <img src={schoolLogo} alt="" width={'80px'} className='rounded-full h-18' style={{boxShadow:'1px 1px 15px blue'}}/>
                <h2 className='font-bold text-2xl my-auto mx-auto'>ROYAL AMBASSADORS SCHOOLS</h2>
                
              </div><br />

            <h2 className='text-xl font-bold mb-2'>Personal Info: </h2>
            <div className='flex flex-col lg:flex-row-reverse gap-2'>
              <div className='addImg border w-fit p-1 rounded-xl m-auto h-fit'>
                <img src={passportpic} alt="" width={'150px'} className='rounded-xl'/>
              </div>
{/* Personal Info */}
              <div className='px-2 my-auto'>
               <div className='mb-2'>
                <label htmlFor="" className='font-bold'>Fullname (Surname, FirstName, LastName):</label>
                <input type="text" className='border w-full h-9 rounded ps-1' placeholder='Adebayo Emeka John'/>
               </div>

               <div className='mb-2'>
                <label htmlFor="" className='font-bold'>Email:</label>
                <input type="email" className='border w-full h-9 rounded ps-1' placeholder='email@gmail.com'/>
               </div>

               <div className='mb-2'>
                <label htmlFor="" className='font-bold'>Phone Number:</label>
                <input type="tel" inputMode='numeric' className='border w-full h-9 rounded ps-1' placeholder='0801 234 5678'/>
               </div>        
             </div>
             </div><br />

{/* Guardian Info */}
           <h2 className='text-xl font-bold mb-2'>Guardian Info: </h2>
            <div className='px-2'>
               <div className='mb-2'>
                <label htmlFor="" className='font-bold'>Guardian Fullname:</label>
                <input type="text" className='border w-full h-9 rounded ps-1' placeholder='Adebayo Emeka John'/>
               </div>

               <div className='mb-2'>
                 <label htmlFor="" className='font-bold'>Guardian Relationship</label>
                 <input type="text" className='border w-full h-9 rounded ps-1' placeholder='Father, Mother, Uncle ...'/>
               </div>

               <div className='mb-2'>
                <label htmlFor="" className='font-bold'>Guardian Phone Number:</label>
                <input type="tel" inputMode='numeric' className='border w-full h-9 rounded ps-1' placeholder='0801 234 5678'/>
               </div>

               <div className='mb-2'>
                <label htmlFor="" className='font-bold'>Address:</label>
                <input type="text" className='border w-full h-9 rounded ps-1' placeholder='House No, Street Name, City, State'/>
               </div>
            </div><br />
{/* Academic Details */}
            <h2 className='text-xl font-bold mb-2'>Academic Details: </h2>
              <div className='px-2'>
                <div>
                  <label htmlFor="" className='font-bold'>Class Applying For: </label>
                  <select name="" id="">
                   
                  </select>
                </div>
              </div>

            </form>
          </div>

        </section>
    </div>
  )
}
