import React from 'react'
import classes from '../assets/Images/studentsclass.jfif'
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa'
import { useState } from 'react'
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const navigate = useNavigate();
  const [Id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]= useState(false)

  const getData = async(e)=> {
    e.preventDefault();
    setLoading(true)

    const {data:dbData, error:dbError} = await supabase 
    .from("adminsignup")
    .select("email")
    .eq("special_id", Id)
    .single();

    if(!dbData || dbError){
      Swal.fire({
        icon:"error",
        title:"Id Not Found",
        text:"This Admin ID is not registered"
      })

      return;
    }

    const {data:authData , error:authError} = await supabase.auth.signInWithPassword({
      email:dbData.email,
      password:password
    })

    if(authError){
      Swal.fire({
        icon:"error",
        title:"Auth Error",
        text:authError.message
      })
    }else{
      Swal.fire({
        icon:"success",
        title:"Successful",
        text:"Login Successfully"
      })
      
      setTimeout(()=> {
        navigate("/admin/dashboard");
      },3000)
      setLoading(false);
    }
  }

  return (
    <div className='h-screen lg:overflow-y-hidden'>
      <div className='flex lg:flex-row flex-col gap-10'>
        <div className=''>
          <img src={classes} alt="" className='loginImg h-screen object-cover lg:rounded-r-[100%_50%] scale-110'/>
        </div>

        <div className='absolute lg:relative w-full lg:w-[45vw] px-2 py-2 flex justify-center lg:place-items-center bottom-0'>

          <div className='py-3 px-2 w-full lg:w-[25vw] h-fit rounded-3xl text-black bg-white lg:bg-transparent'>
          <div className='text-center'>
            <h2 className='font-bold text-4xl px-2 mt-2'>Login <br /> <span className='text-3xl font-light'>To your account</span></h2>
            <p className='text-2xl px-2'>Continue to dashboard</p>
          </div>
          <br />
          <form action="" onSubmit={getData}>
            <div className='px-2 lg:px-0 pb-2 mt-2 mb-2 flex place-items-center'>
              <div className='absolute text-2xl ps-2 text-slate-400'>
                <FaUser/>
              </div>
              <input type="text" className='border shadow-2xl w-full ps-9 rounded-xl h-13 border-t-0 border-l-0 border-r-0' placeholder='Enter Your ID' onChange={(e)=> setId(e.target.value)}/>
            </div>

             <div className='px-2 lg:px-0 pb-2 mt-2 mb-2 flex place-items-center'>
              <div className='absolute text-2xl ps-2 text-slate-400/90'>
                <FaLock/>
              </div>
              <input type="password" className='border shadow-2xl w-full ps-9 rounded-xl h-13 border-t-0 border-l-0 border-r-0' placeholder='Enter Your Password' onChange={(e)=> setPassword(e.target.value)}/>
            </div>

             <div className='flex justify-center'>
              <button className='p-2 bg-green-800/90 w-30 rounded-xl text-white h-10' disabled={(!Id,!password)}>{loading ? <FaSpinner className='animate-spin mx-auto'/> : "login"}</button>
            </div>
          </form>
        </div>
        </div>
        
      </div>
    </div>
  )
}
