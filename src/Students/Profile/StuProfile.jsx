import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2';

export const StuProfile = () => {

    const [profile, setProfile]= useState(null);
    const [loading, setLoading]= useState(true);
    const [btnSpinner, setBtnspinner]= useState(false);
    const [fullname, setFullname]=useState("");
    const [email, setEmail]=useState("");
    const [phoneNumber, setPhonenumber]=useState("");
    const [post, setPost]=useState("");
    const [gender, setGender]=useState("");
    const [dob, setDob]=useState("");
    const [club, setClub] = useState([]);
    const [studClub, setStudclub] = useState("")

     const fetchdata = async()=>{
        const {data: {user}} = await supabase.auth.getUser();
        
        const {data: studentData, error: studentError} = await supabase
        .from("studentsignup")
        .select("*")
        .eq("id", user.id)
        .single();
    
        if(studentError){
          console.log("Error" + studentError.message);
        }else{
          setProfile(studentData);
          setStudclub(studentData.club_name || "");
        }

        try{
         const {data: clubData, error: clubError} = await supabase
         .from("royal_club")
         .select("*")

         if(clubError) throw clubError
         setClub(clubData)
        }catch(error){
          Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
          })
          console.log("Error" + error.message)
        }finally{
          setLoading(false)
        }
      }
    
      const editProfile = async(e)=>{
        e.preventDefault();
        setBtnspinner(true);
    
        const {data: {user}} = await supabase.auth.getUser();
        const {error} = await supabase
        .from("studentsignup")
        .update({
          full_name: fullname || profile.full_name,
          email: email || profile.email,
          phone_number: phoneNumber || profile.phone_number,
          gender: gender || profile.gender,
          post: post || profile.post,
          club_name: studClub || profile.club_name
        })
        .eq("id", user.id)
       
        if(error){
          console.log("Error" + error.message);
        }else{
          Swal.fire({
            icon:"success",
            title:"Success",
            text:"Uploaded successful"
          }) 
          setBtnspinner(false);
        }
    
    
      }
    
      useEffect(()=> {
      fetchdata();
      },[])
    
      if(loading){
        return (
          <div className='h-80 flex flex-col justify-center place-items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14"/><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29"/><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43"/><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57"/><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71"/><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86"/><circle cx="12" cy="21.5" r="1.5" fill="currentColor"/><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"/></g></svg>
    
            <p className='mt-2'>Fetching Profile</p>
          </div>
        )
      }
  return (
   <div>
         <div>
          <h2 className='mt-2 font-bold text-xl text-blue-600'>Edit Profile</h2>
          <form className='form grid md:grid-cols-2 gap-4 py-2' onSubmit={editProfile}>
            <div className='grid'>
              <label htmlFor="">Full Name</label>
              <input type="text" defaultValue={profile.full_name} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e)=>setFullname(e.target.value)}/>
            </div>

            <div className='grid'>
              <label htmlFor="">Email</label>
              <input type="text" defaultValue={profile.email} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e)=> setEmail(e.target.value)}/>
            </div>

            <div className='grid'>
              <label htmlFor="">Phone Number</label>
              <input type="text" defaultValue={profile.phone_number || "no phone number added yet"} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e)=> setPhonenumber(e.target.value)}/>
            </div>

           <div className='grid'>
              <label htmlFor="">Student ID</label>
              <span className='border h-12 p-3 rounded-xl text-slate-400'>
               {profile.special_id}
              </span>
           </div>

            <div className='grid'>
              <label htmlFor="">Gender</label>
              <select name="" id="" className='border h-12 p-3 mt-2 rounded-xl' defaultValue={profile.gender} onChange={(e)=>setGender(e.target.value)}>
                <option disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

             <div className='grid'>
              <label htmlFor="">Club</label>
              <select name="" id="" className='border h-12 rounded-xl mt-2 p-2 bg-white text-black' value={studClub} onChange={(e)=>setStudclub(e.target.value)}>
                  <option value="" disabled>Select a Club</option>
                  {club.map((clubs)=>(
                    <option value={clubs.club_name} key={clubs.id}>{clubs.club_name}</option>
                  ))}
              </select>
            </div>

             
              <button type="submit" className='lg:w-40 w-full h-10 rounded-xl text-white bg-blue-600' disabled={btnSpinner}>{btnSpinner ?  <span className='flex justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="22" height="22" fill="none"/><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14"/><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29"/><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43"/><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57"/><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71"/><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86"/><circle cx="12" cy="21.5" r="1.5" fill="currentColor"/><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"/></g></svg></span> : "Update"}</button>
          </form>
         </div>
  
    </div>
  )
}