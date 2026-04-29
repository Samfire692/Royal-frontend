import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';

export const SubjectSetting = () => {

  const [subjectArray, setSubjectarray]= useState([]);
  const [btnLoading, setBtnloading]= useState(false);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [delLoading, setDelloading] = useState(null);
  const [menu, setMenu] = useState(null);
  const [editMenu, setEditmenu] = useState(null);
  const [newSubject, setNewsubject] = useState("")
  const [editLoading, setEditloading]= useState(false)
  const [prevLength, setPrevLength] = useState(0);

  const bottomRef = useRef(null);
  const scrollBottom = ()=> {
    bottomRef.current?.scrollIntoView({behavior:"smooth"})
  }

  const sendSubject = async(e)=>{
    e.preventDefault();
    setBtnloading(true)

    try{
      const {error}= await supabase
      .from("subjects")
      .insert({
        subject_name:subject
      })

      if(error) throw error;

      Swal.fire({
        icon:"success",
        title:"Success",
        text:`${subject} added successfully`
      })

      setBtnloading(false)
      setSubject("")
    }catch(error){
      if(error.code === '23505'){
        Swal.fire({
          icon:"error",
          title:"Duplicate",
          text:`${subject} already exists`
        })
      }else if(error.message.includes("Fetch")){
        Swal.fire({
          icon:"error",
          title:"Error",
          text:"Check your internet connection"
        })
      }else{
        Swal.fire({
          icon:"error",
          title:"Error",
          text:error.message
        })
      }
    }finally{
      setBtnloading(false)
    }
  }

  const deleteSubject = async(id)=> {

    const result = await Swal.fire({
      icon:"warning",
      title:"Are you sure ?",
      text:"You wont be able to revert this!",
      showCancelButton:true,
      confirmButtonText:"Delete",
      confirmButtonColor:"#d33",
      cancelButtonText:"No, wait",
      cancelButtonColor:"#3085d6"
    })

    if(result.isConfirmed){
      setDelloading(id)

      try{
        const {error}= await supabase
        .from("subjects")
        .delete()
        .eq("id",id)
        
        if(error) throw error

         Swal.fire({
          icon:"success",
          title:"Succesful",
          text:"deleted successfully"
        })

        setDelloading(null)
      }catch(error){
        Swal.fire({
          icon:"error",
          title:"Error",
          text:error.message
        })
      }finally{
        setDelloading(null);
        fetchsubject();
        setMenu(null);
      }
    }
  }

 const editSubject = async(id)=> {
   const editresult = await Swal.fire({
    icon:"question",
    title:"Are you sure ?",
    text:"You wont be able to revert this!",
    showCancelButton:true,
    confirmButtonText:"Upload",
    confirmButtonColor:"blue",
    cancelButtonText:"No, wait",
   })

   if(editresult.isConfirmed){
    try{
      const {error} = await supabase
      .from("subjects")
      .update({
        subject_name:newSubject
      })
      .eq("id",id)
     
      if(error) throw error

      Swal.fire({
        icon:"success",
        title:"Successful",
        text:"Updated successfully"
      })
    }catch(error){
      Swal.fire({
        icon:"error",
        title:"Error",
        text:error.message
      })
    }finally{
      setEditloading(false)
      fetchsubject();
      setEditmenu(null)
    }
   }
 }

  const fetchsubject= async()=>{
    const {data, error} = await supabase
    .from("subjects")
    .select("*")
    .order("created_at", {ascending:true})

    if(error){
       Swal.fire({
        icon:"error",
        title:"Error",
        text:error.message
      })
       setBtnloading(false)
    }else{
      setLoading(false)
      setSubjectarray(data);
    }

    fetchsubject()
  }

  useEffect(()=>{
    fetchsubject();
  },[])

 useEffect(() => {
  if (subject.length > prevLength) {
    setTimeout(() => {
      scrollBottom();
    }, 100); 
  }
  setPrevLength(subject.length);
}, [subject, prevLength]);

  if(loading){
   return(
    <div className='h-[50vh] flex flex-col justify-center place-items-center'>
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="32" height="32" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg>
       <p className='mt-2'>Fetching Subjects . . .</p>
    </div>
   )
  }
  return (
    <div>
      <div className='mb-2'>
        <h2 className='font-bold text-xl'>Subject Settings</h2> 
      </div><hr className='w-38'/>

      <section>
        <form action="" className='' onSubmit={sendSubject}>
           <div className='grid mt-3 w-full'>
             <label htmlFor="">Add Subject</label>
             <div className='flex justify-end'>
                <input type="text" className='border h-11 p-3 mt-1 w-full text-black' placeholder='Add subjects' onChange={(e)=>setSubject(e.target.value)} value={subject}/>
                {subject.length > 0 && (
                  <button className='absolute my-3 me-2' type='button' onClick={()=>setSubject("")}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><defs><mask id="SVGzptI4dvL"><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="#fff" fill-opacity="0" stroke="#fff" stroke-dasharray="60" d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.4s" to="1"/></path><path fill="none" stroke="#000" stroke-dasharray="8" stroke-dashoffset="8" d="M12 12l4 4M12 12l-4 -4M12 12l-4 4M12 12l4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.1s" dur="0.2s" to="0"/></path></g></mask></defs><path fill="red" d="M0 0h24v24H0z" mask="url(#SVGzptI4dvL)"/></svg></button>
                )}
             </div>
           </div>

           <div className='flex justify-end'>
            <button className='w-30 h-11 mt-2 rounded-xl bg-blue-500 text-white' disabled={!subject}>{btnLoading ? <span className='flex justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg></span> : "Submit"}</button>
           </div>
        </form>
      </section>

      <section id='subjectArray'>
        <div className='subjectArray mt-3 pb-3 grid grid-cols-1 md:grid-cols-3 gap-3'>

{/* Subject Array */}
         {subjectArray.map((item)=> (
          <div key={item.id} className='p-3 shadow-sm shadow-slate-500/40 rounded-xl h-fit'>
           <div className='flex justify-between'>
             <p className='font-bold'>{item.subject_name}</p>
              <button onClick={()=>setMenu(menu === item.id ? " " : item.id)} className={`${editMenu === item.id ? "hidden" :"" }`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" fill-rule="evenodd" d="M10.5 5A1.5 1.5 0 0 1 12 3.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5zm0 7a1.5 1.5 0 0 1 1.5-1.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5zm1.5 5.5a1.5 1.5 0 0 0-1.5 1.5v.01a1.5 1.5 0 0 0 1.5 1.5h.01a1.5 1.5 0 0 0 1.5-1.5V19a1.5 1.5 0 0 0-1.5-1.5z" clip-rule="evenodd"/></svg></button>
           </div>

           <div ref={bottomRef}></div>

{/* edit */}
         {editMenu === item.id && (
           <div className='mt-2 flex gap-1'>
            <input type="text" className='border w-full h-8 p-2' defaultValue={item.subject_name} onChange={(e)=> setNewsubject(e.target.value)}/>
            <button className='bg-blue-600 w-12 h-7 text-white rounded my-auto' onClick={()=>editSubject(item.id)}><span className='flex justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="18" d="M21 5l-2.5 15M21 5l-12 8.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="18;0"/></path><path stroke-dasharray="24" d="M21 5l-19 7.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M18.5 20l-9.5 -6.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.3s" to="0"/></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M2 12.5l7 1"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.3s" to="0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M12 16l-3 3M9 13.5l0 5.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.3s" to="0"/></path></g></svg></span></button>
          </div>
         )}

{/* menu */}
         {menu === item.id && (
           <div className='flex justify-end mt-2'>
            <div className='shadow-sm shadow-slate-500/40 w-20 p-1 rounded bg-white absolute'>

{/* edit button */}
             <button className=' w-18 mb-1 text-blue-600 font-semibold' onClick={()=> {setEditmenu (editMenu === item.id ? "" : item.id),setMenu(false)}}>Edit</button><hr className='text-slate-300'/>

{/* delete button */}
             <button className='w-18 mt-1 text-red-600 font-semibold' onClick={()=> deleteSubject(item.id)}>{delLoading === item.id ? <span className='flex justify-center pt-1'><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg></span> : "Delete"}</button>
            </div>
          </div>
          
         )}

          </div>
         ))}
        </div>
      </section>
    </div>
  )
}
