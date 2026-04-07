import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

export const TeachSignUp = () => {
 const [fullname, setFullname] = useState("");
   const [email, setEmail]= useState("");
   const [password, setPassword]= useState("")
   const [loading, setLoading] = useState(false);
   const [adminCode, setAdminCode] = useState([]);
 
   const handleData = async(e)=> {
     e.preventDefault();
     setLoading(true)
 
     const firstname = fullname.trim().split(/\s+/)[0].toUpperCase();
     const randomDigits = Math.floor(1000 + Math.random() * 9000);
     const specialId = `TEAC_${firstname}_${randomDigits}`;
     const email = `${firstname.toLowerCase()}@gmail.com`;
     const password = "TEACHER_0000"
 
     const {data:authData, error:authError} = await supabase.auth.signUp({
       email:email,
       password:password,
     })
 
     if(authError){
       Swal.fire({
         icon:"error",
         title:"Auth Failed",
         text: authError.message
       })
     }
 
     const {error:dbError} = await supabase
     .from("teachersignup")
     .insert([{
       id:authData.user.id,
       full_name:fullname,
       email:email,
       special_id:specialId,
       role:"Teacher"
     }])
 
     if(dbError){
       Swal.fire({
         icon:"error",
         title:"Error",
         text:dbError.message
       })
     }else{
       Swal.fire({
         icon:"success",
         title:"Success",
         text:"Code generated Successfully"
       })
       
       setFullname("");
       setLoading(false);
     }
     
   }
  return (
     <div className='py-2 lg:w-[59vw]'>
          <div className='mb-3 px-3'>
            <h2 className='font-bold text-2xl text-blue-600 text-center mb-2'>Teacher Signup</h2>
          </div>
    
        <section id='adminGen'>
          <div className='adminGen mt-3.5 px-2'>
           <form action=""  onSubmit={handleData} className=''>
            <div className='py-2 lg:px-3'>
              <input type="text" className='border w-full p-2 rounded-xl outline-blue-700' placeholder='Enter fullname' onChange={(e)=> setFullname(e.target.value)} value={fullname}/>
            </div>
            <div className='flex justify-center'>
            <button className='p-2 bg-blue-600/90 text-white rounded mt-2 cursor' disabled={!fullname}>
            {loading ? <FaSpinner className='animate-spin w-25 h-5'/> : "Generate Code" }
            </button>
    
             {/* <div className='adminCodeView'>
             {adminCode.map((items) => (
              <p key={items.full_name}>{items.special_id}</p>
             ))}
             </div> */}
    
            </div>
           </form>
          </div>
        </section>
    
        </div>
  )
}
