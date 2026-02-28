import React from 'react'
import { useState } from 'react'
import Swal from 'sweetalert2'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export const Login = () => {
 const [showpassword , setShowpassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [email, setEmail]= useState("");
 const [password, setPassword]= useState("");
 const navigate = useNavigate();

 const login =async(e)=> {
    e.preventDefault();
    setLoading(true)

  

    
    try{
            const response = await axios.post("http://127.0.0.1:4000/api/authrouter/login", {email, password})
        
            // console.log(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user))
            localStorage.setItem("session", JSON.stringify(response.data.session))
            setLoading(false);

            Swal.fire({
              icon:"success",
              title:"Successful",
              text:"You've logged-in successful please wait . . .",
              timer:2000
            })

           setTimeout(()=> {
            navigate("/admin/dashboard");
           }, 2000)


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
    <div className='h-screen flex flex-col lg:flex-row lg:place-items-center lg:justify-center justify-center  text-center lg:text-start px-3'>
        <div className='lg:w-[50vw]'>
            <h2 className='text-3xl font-bold lg:w-[30vw] md:w-[80vw] md:mx-auto italic'>General, Welcome Back. The portal is live. Command your day.</h2>
        </div><br /><br />

        <div className='border-2 border-white py-4 px-3 lg:w-[30vw] md:w-[50vw] md:mx-auto rounded-3xl mb-50 lg:mb-0'>
            <h3 className='font-bold text-3xl mb-4'>Login</h3>
            <form action="" className='flex flex-col gap-2' onSubmit={(e)=> login(e)} >
               <div className='relative'>
                 <input type="email"  placeholder='Enter your email' className='w-full py-4 border-2 border-white focus:shadow-slate-900 shadow focus:outline-0 px-2 rounded-2xl' onChange={(e)=> setEmail(e.target.value)}/>
               </div>

               <div className='flex justify-end'>
                 <input type={showpassword ? "text" : "password"}  placeholder='Enter your password' className='w-full py-4 border-2 border-white focus:shadow-slate-900 shadow focus:outline-0 px-2 rounded-2xl' onChange={(e)=> setPassword(e.target.value)}/>
                 <span className='absolute text-2xl my-4 me-2' onClick={()=> setShowpassword(!showpassword)}>
                    {showpassword ? <FaEyeSlash/> : <FaEye/>}
                 </span>
               </div>

              <div className='text-center'>
                 <button type='submit' className='border-white border py-2.5 w-40 bg-green-500 rounded-2xl mt-2' disabled={loading || !email || !password}>{loading ? "loading . . ." : "login"}</button>
              </div>
            </form>
        </div>
    </div>
  )
}
