import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export const Signup = () => {
  const [showpassword , setShowpassword] = useState(false);
  const [Cshowpassword , setCShowpassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [fullname, setFullname] = useState("")
  const [email, setEmail]= useState("")
  const [password, setPassword]= useState("")
  const [Cpassword, setCPassword]= useState("")
 
  const signup = async(e)=> {
       e.preventDefault();
       setLoading(true)
     
    
      if (password !== Cpassword) {
      Swal.fire({
      icon: 'warning',     
      title: 'Password Mismatch',
      text: 'Both passwords must match.',
    });
      setLoading(false)
      return ;
  }

    try{
       const response = await axios.post("http://127.0.0.1:4000/api/authrouter/signup", {fullname, email, password})

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
         });
            setLoading(false);

    }catch(error){
         let err = "Error connecting to the server!";

            if(error.response?.data?.error){
                Swal.fire({
                  icon:"warning",
                  title:"Warning",
                  text:error.response?.data?.error
                })
                 setLoading(false);
                return;
            }

            Swal.fire({
              icon:"error",
              title:"Error",
              text:err
            })
             setLoading(false);
            return;
    }
  }

  return (
     <div className='px-1'>
    
            <div className='border-2 border-blue-300 bg-slate-300 pt-6 pb-2 px-3 lg:w-[30vw] md:w-[50vw] md:mx-auto rounded-3xl mb-50 lg:mb-0'>
                <h3 className='font-bold text-3xl mb-4 text-blue-950'>Admin SignUp</h3>

                <form action="" className='flex flex-col gap-2' onSubmit={(e)=> signup(e)} >
                  <div className='relative'>
                     <input type="text"  placeholder='Enter your Fullname' className='w-full py-4 border-2 border-white focus:shadow-slate-900 shadow focus:outline-0 px-2 rounded-2xl' onChange={(e)=> setFullname(e.target.value)}/>
                   </div>

                   <div className='relative'>
                     <input type="email"  placeholder='Enter your email' className='w-full py-4 border-2 border-white focus:shadow-slate-900 shadow focus:outline-0 px-2 rounded-2xl' onChange={(e)=> setEmail(e.target.value)}/>
                   </div>
    
                   <div className='flex justify-end'>
                     <input type={showpassword ? "text" : "password"}  placeholder='Enter your password' className='w-full py-4 border-2 border-white focus:shadow-slate-900 shadow focus:outline-0 px-2 rounded-2xl' onChange={(e)=> setPassword(e.target.value)}/>
                     <span className='absolute text-2xl my-4 me-2' onClick={()=> setShowpassword(!showpassword)}>
                        {showpassword ? <FaEyeSlash/> : <FaEye/>}
                     </span>
                   </div>

                   <div className='flex justify-end'>
                     <input type={Cshowpassword ? "text" : "password"}  placeholder='Confirm password' className='w-full py-4 border-2 border-white focus:shadow-slate-900 shadow focus:outline-0 px-2 rounded-2xl' onChange={(e)=> setCPassword(e.target.value)}/>
                     <span className='absolute text-2xl my-4 me-2' onClick={()=> setCShowpassword(!Cshowpassword)}>
                        {Cshowpassword ? <FaEyeSlash/> : <FaEye/>}
                     </span>
                   </div>
    
                  <div className='text-center pt-2'>
                     <button className='border-2 px-6 py-2 rounded-xl bg-slate-500 text-white' disabled={loading || !fullname || !email || !password || !Cpassword}>
                        {loading ? "creating your acc . . ." : "signup"}
                     </button>
                  </div>
                </form>
            </div>
        </div>
  )
}
