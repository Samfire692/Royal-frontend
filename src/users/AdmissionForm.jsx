import React, { useState , useEffect} from 'react'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'
import passportpic from '../assets/Images/admin profile pic.jfif'
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'

export const AdmissionForm = () => {
  const [classes, setClasses] = useState([]);

  const fetchClass = async()=> {
    const {data, error} = await supabase
      .from('royalclassrooms')
      .select('*')
      .order('created_at', {ascending:"true"})

      if(error){
         Swal.fire({
           icon:"warning",
           title:"oops",
           text:"failed to fetch: " + error.message, 
          })
      }else{
        setClasses(data);
      }
  }

  useEffect(() => {
  fetchClass();
   }, []);

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
                <select name="classSelect" id="classSelect" className='border w-full p-2 rounded'>
                  <option className='bg-blue-600' value="">-- Select a Class --</option>
                  {classes.map((items) => (
                  <option className='bg-blue-600' key={items.id} value={items.class_name}>
                  {items.class_name}
                  </option>
                 ))}
                </select>
                </div>
              </div>

            </form>
          </div>

        </section>
    </div>
  )
}
