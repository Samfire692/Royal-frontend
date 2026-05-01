import React, { useState, useEffect } from 'react'
import { FaPlus, FaSpinner, FaEllipsisV, FaEdit, FaTrash, FaUpload } from 'react-icons/fa'
import { supabase } from '../../supabaseClient'
import axios from 'axios'
import Swal from 'sweetalert2'

export const ClassSettings = () => {
  
   const [addClasses, setAddclasses] = useState("");
   const [sendLoading, setSendloading] = useState(false);
   const [classesArray, setClassesarray] = useState([]);
   const [subjects, setSubjects] = useState([]);
   const [classSubjects, setClasssubject] = useState([])
   const [search, setSearch] = useState("");
   const [activeClasssub, setActiveclassSub] = useState(false)
   const [menu, setMenu] = useState(null);
   const [delLoading, setDelloading] = useState(false);
   const [editMenu, setEditmenu] = useState(null);
   const [newClass, setNewclass] = useState("");
   const [editLoading, setEditloading]= useState(null);
   const [loading, setLoading] = useState(true);

   const sendClasses = async (e) => {
      e.preventDefault();
      
      if (!addClasses || classSubjects.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Missing Info",
          text: "Please add a class name and select at least one subject."
        });
        return;
      }

      try {
       setSendloading(true)

       // 1. Insert the Class and get the returned ID immediately
       const { data: newClass, error: classError } = await supabase
       .from("royalclassrooms")
       .insert({
        class_name: addClasses
       })
       .select()
       .single();
       
       if (classError) throw classError

       // 2. Map through selected subjects to link them to the New Class ID
       const junctions = classSubjects.map((subject) => ({
         class_id: newClass.id,
         subject_id: subject.id,
       }));

       // 3. Insert all links into the join table (class_subjects)
       const { error: junctionError } = await supabase
       .from("class_subjects")
       .insert(junctions);

       if (junctionError) throw junctionError
       
       Swal.fire({
        icon: "success",
        title: "Successful",
        text: `${addClasses} and its subjects added successfully`
       })

       // Reset everything
       setAddclasses("")
       setClasssubject([])
       setSearch("")
       fetchClasses(); 
       
      } catch (error) {
        if (error.code === '23505') {
            Swal.fire({
            icon: "error",
            title: "Duplicate",
            text: `${addClasses} already exists`
         })
        } else {
            Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message
        })
        }
      } finally {
        setSendloading(false)
      }
   }

   const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
     .from("royalclassrooms")
     .select(`
      id,class_name,class_subjects(subjects(subject_name))
      `)
     .order("created_at", { ascending: true })

     if (error) throw error
     setClassesarray(data);
     setLoading(false);

    } catch (error) {
      console.error("Error fetching classes:", error.message)
    }
  }

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
     .from("subjects")
     .select("*")
     .order("created_at", { ascending: true })

     if (error) throw error
     setSubjects(data);

    } catch (error) {
      console.error("Error fetching subjects:", error.message)
    }
  }

    const delClass = async(id)=> {
      const delResult= await Swal.fire({
        icon:"question",
        title:"Are you sure ?",
        text:"You wont be able to revert this!",
        showCancelButton:true,
        confirmButtonText:"Delete",
        confirmButtonColor:"#d33",
        cancelButtonText:"No, wait",
        cancelButtonColor:"#3085d6"
      })

      if(delResult.isConfirmed){
        try{
          setDelloading(id)
          const {error} = await supabase
          .from("royalclassrooms")
          .delete()
          .eq("id",id)
        
        if(error) throw error;

        Swal.fire({
          icon:"success",
          title:"Successful",
          text:"Deleted successfully"
        })

      }catch(error){
        if(error.message.includes("Fetch")){
          Swal.fire({
            icon:"error",
            title:"Error",
            text:"No Internet Connection"
          })
        }else{
          Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
          })
        }
      }finally{
        setDelloading(false)
        fetchClasses()
      }
    }

  }

  const editClass = async (id)=> {
    const editResult = await Swal.fire({
      icon:"question",
        title:"Are you sure ?",
        text:"You wont be able to revert this!",
        showCancelButton:true,
        confirmButtonText:"Update",
        confirmButtonColor:"blue",
        cancelButtonText:"No, wait",
        cancelButtonColor:"#3085d6"
    })

    if(editResult.isConfirmed){
      try{
       setEditloading(id)
       const {error}= await supabase
       .from("royalclassrooms")
       .update({
        class_name:newClass
       })
       .eq("id", id)

       if(error) throw error
       Swal.fire({
        icon:"success",
        title:"Successful",
        text:"Updated successfully"
       })

       setEditmenu(false)
       setMenu(false);
      }catch(error){
        if(error.message.includes("Fetch")){
          Swal.fire({
            icon:"error",
            title:"Error",
            text:"No Internet connection !"
          })
        }else{
          Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
          })
        }
      }finally{
        fetchClasses()
        setEditloading(false)
      }
    }
  }

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
  }, [])

  const filteredSubjects = search === "" 
  ? [] 
  : subjects.filter((item) => 
      item.subject_name.toLowerCase().includes(search.toLowerCase())
    );

    if(loading){
      return(
      <div className='h-[50vh] flex flex-col justify-center place-items-center'>
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="32" height="32" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg>
       <p className='mt-2'>Fetching Classes . . .</p>
      </div>
      )
    }

  return (
    <div>
        <div className='mb-1'>
            <h2 className='font-bold text-xl'>Class Settings</h2>
        </div><hr className='w-33'/>

      <section>
        <form className='mt-2' onSubmit={sendClasses}>
          <h2>Add Class</h2>
          
          <div className='flex justify-end relative'>
            <input 
              type="text" 
              className='border h-11 p-3 w-full mt-1' 
              placeholder='Add Classes' 
              onChange={(e) => setAddclasses(e.target.value)} 
              value={addClasses}
            />
            {addClasses.length > 0 && (
              <button 
                className='absolute my-3 me-2' 
                type='button' 
                onClick={() => setAddclasses("")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><defs><mask id="SVGzptI4dvL"><g stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="#fff" fill-opacity="0" stroke="#fff" stroke-dasharray="60" d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.4s" to="1"/></path><path fill="none" stroke="#000" stroke-dasharray="8" stroke-dashoffset="8" d="M12 12l4 4M12 12l-4 -4M12 12l-4 4M12 12l4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.1s" dur="0.2s" to="0"/></path></g></mask></defs><path fill="red" d="M0 0h24v24H0z" mask="url(#SVGzptI4dvL)"/></svg>
              </button>
            )}
          </div>

          <div className='mt-4 relative'>
            <label className='text-sm text-gray-600'>Search & Add Subjects</label>
            <input 
              type="text" 
              className='border w-full h-11 p-3 mt-1' 
              placeholder='Type subject name...' 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filteredSubjects.length > 0 && (
              <div className='absolute z-10 w-full bg-white rounded-2xl mt-1 shadow-sm shadow-slate-500/40 px-2 max-h-40 overflow-y-auto'>
                {filteredSubjects.map((item) => (
                  <div 
                    key={item.id} 
                    className='p-3 hover:bg-blue-50 cursor-pointer border-b border-be-slate-300 last:border-b-0'
                    onClick={() => {
                      if (!classSubjects.find(s => s.id === item.id)) {
                        setClasssubject([...classSubjects, item]);
                      }
                      setSearch(""); 
                    }}
                  >
                    {item.subject_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='mt-2 flex flex-wrap gap-2'>
            {classSubjects.map((item) => (
              <div key={item.id} className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium'>
                {item.subject_name}
                <button 
                  type="button" 
                  className='text-red-500 font-bold'
                  onClick={() => setClasssubject(classSubjects.filter(s => s.id !== item.id))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className='mt-4 flex justify-end'>
             <button className='bg-blue-500 text-white w-20 h-10 rounded-xl'>
               {sendLoading ? (
                 <span className='flex justify-center'>
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg>
                 </span>
               ) : "Submit"}
             </button>
          </div>
        </form>
      </section>

      <section className='mt-1'>
        <h3 className='font-bold border-b pb-2'>Available Classes</h3>
        <div className='pb-10 grid gap-2 mt-2'>
          {classesArray.map((item) => (
            <div key={item.id} className='p-2 shadow rounded-2xl'>
             <div className='flex justify-between'>
              <p className='capitalize text-blue-600 font-bold cursor-pointer' onClick={()=>setActiveclassSub(activeClasssub === item.id ? "" : item.id)}>{item.class_name}</p>
              <button className={` ${editMenu === item.id ? "hidden" : null}`} onClick={()=> setMenu(menu === item.id ? "" : item.id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" fill-rule="evenodd" d="M10.5 5A1.5 1.5 0 0 1 12 3.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5zm0 7a1.5 1.5 0 0 1 1.5-1.5h.01a1.5 1.5 0 0 1 1.5 1.5v.01a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5zm1.5 5.5a1.5 1.5 0 0 0-1.5 1.5v.01a1.5 1.5 0 0 0 1.5 1.5h.01a1.5 1.5 0 0 0 1.5-1.5V19a1.5 1.5 0 0 0-1.5-1.5z" clip-rule="evenodd"/></svg></button>
             </div>
            
             {menu === item.id && (
             <div className='flex justify-end'>
              <div className={`grid gap-1 w-20 shadow-sm shadow-slate-500/40 rounded p-1 absolute bg-white ${editMenu === item.id ? "hidden" : null}`}>
               <button className='text-blue-600' onClick={()=> setEditmenu(editMenu === item.id ? " " : item.id)}>Edit</button><hr className='text-slate-400'/>

               <button className='text-red-600' onClick={()=> delClass(item.id)}>{delLoading === item.id ? <span className='flex justify-center pt-1'><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg></span> : "Delete"}</button>
             </div>
             </div>
             )}

             {editMenu === item.id && (
              <div className='flex mt-2 gap-2'>
              <input type="text" className='border w-full h-11 p-3' defaultValue={item.class_name} onChange={(e)=> setNewclass(e.target.value)}/>
              <button className='bg-blue-600 w-12 h-9 text-white rounded my-auto' onClick={()=> editClass(item.id)}>{editLoading === item.id 
              ?
              <span className='flex justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg></span>
              : 
              <span className='flex justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="18" d="M21 5l-2.5 15M21 5l-12 8.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="18;0"/></path><path stroke-dasharray="24" d="M21 5l-19 7.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M18.5 20l-9.5 -6.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.3s" to="0"/></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M2 12.5l7 1"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.3s" to="0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M12 16l-3 3M9 13.5l0 5.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.3s" to="0"/></path></g></svg></span> 
             }</button>
             </div>
             )}

              {activeClasssub === item.id && (
                <div className='flex flex-wrap gap-3 mt-2.5 ps-2 transition-all'>
                {item.class_subjects && item.class_subjects.map((sub)=>(
                   <div key={sub.id}>
                    <p className='border-l border-r px-1 rounded'>{sub.subjects.subject_name}</p>
                   </div>
                ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}