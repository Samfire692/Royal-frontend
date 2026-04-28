import React, { useState } from 'react'
import { useEffect } from 'react'
import { FaPlus, FaSpinner, FaEllipsisV, FaEdit, FaTrash, FaUpload } from 'react-icons/fa'
import { supabase } from '../../supabaseClient'
import axios from 'axios'
import Swal from 'sweetalert2'


export const ClassSettings = () => {

    const [loading , setLoading] = useState(false);
    const [className , setClassName] = useState("");
    const [allClasses, setAllClasses] = useState([]);
    const [activeId, setActiveId] = useState(false);
    const [editClassId, setEditClassId] = useState(false);
    const [editClassname, setEditClassname] = useState("");

    const fetchClasses = async (e)=> {
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
        setAllClasses(data)
      }
    }

    useEffect((e)=> {
        fetchClasses();
    }, [])
 
    const handleClasses = async (e)=>{
       e.preventDefault();
       setLoading(true)

        const {data:insertedData, error} = await supabase 
         .from("royalclassrooms")
         .insert([{class_name: className}])
         .select()

        if (error) {
         console.error("Supabase Error:", error.message); 
         Swal.fire({
         icon: "error",
         title: "Oops...",
         text: "Failed to add class: " + error.message,
        });
        } else {
        console.log("New Class Created:", insertedData);
         Swal.fire({
         icon: "success",
         text: "Class added successfully! 🎓",
         timer: 2000, 
         showConfirmButton: false
        });
    }
    setClassName("");
    fetchClasses();

         setLoading(false)
   }

   const deleteClass = (id)=> {
     Swal.fire({
        icon:"warning",
        title:"Are you sure?",
        text:"You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonColor:"#d33",
        confirmButtonText: "Yes, delete it!"
     }).then((result) => {
        if(result.isConfirmed){
            handledelclass(id);
        }
     })
   }

   const handledelclass = async(id)=> {
      const {data, error} = await supabase 
      .from("royalclassrooms")
      .delete()
      .eq("id",id)

      if(error){
        Swal.fire({
            icon:"warning",
            title:"Oops",
            text:"Failed to delete :" + error.message
        })
      }else{
         fetchClasses();
      }
   }

   const handleEditclass = async (id)=> {

      const {data, error} = await supabase
      .from("royalclassrooms")
      .update([{class_name: editClassname}])
      .eq("id", id)
      .select()

      if(error){
        Swal.fire({
            icon:"warning",
            title:"Oops",
            text:"Failed to updated :" + error.message
        })
      }else{
         fetchClasses(); 
      }

      setEditClassId(false)
   }

    const clearClasses = (e)=>{
        e.preventDefault();
        setClassName("")
    }

  return (
    <div>
        <div className='mb-1'>
            <h2 className='font-bold text-xl'>Class Settings</h2>
        </div><hr className='w-33'/>

        <section id='classSet'>
            <div className='classSet mt-3'>
              <div>
                <h2 className='flex mb-1 text-slate-500/90'><span className='text-xl my-auto'><FaPlus/></span> <span className='font-bold'>Add Class</span></h2> 
                 <form action="" className='overflow-hidden' onSubmit={handleClasses}>
                   <input type="text" className='border rounded ps-2 py-2 w-full' placeholder='Insert class' onChange={(e)=> setClassName(e.target.value)} value={className} />  
                   <div className='flex mt-2 gap-2 justify-end me-2'>
                   <button className='bg-red-500 p-1 rounded text-white' type='button' onClick={clearClasses}>Cancel</button>
                   <button className='bg-blue-500 p-1 rounded text-white' disabled={!className}>{loading ? <FaSpinner className='animate-spin w-11 h-4 text-xl'/> : "submit"}</button>
                </div> 
                 </form> 
                </div>

                <div className='w-full mt-2 grid lg:grid-cols-4 grid-cols-2'>
                  {allClasses.map((item, index)=> (
                    <div key={item.id} className=''>
                        <div className='flex justify-between pt-2'>
                            <div className={`text-black w-full p-2 rounded place-items-center flex justify-between ${activeId === item.id ? "bg-slate-200 transition-all" : "bg-white text-black"}`} onClick={()=> setActiveId (item.id)}><span className='text-blue-600 font-bold'>{index + 1}. {item.class_name}</span>
                            
                            {activeId === item.id && (
                                <div className='flex text-xl'>
                                 <button className='text-green-500 p-2 focus:bg-green-200 rounded-full transition-all' onClick={()=> {setEditClassId(item.id); setEditClassname(item.class_name)}}><FaEdit/></button>
                                 <button className='p-2 focus:bg-red-200 rounded-full transition-all text-red-500' onClick={(e)=> {e.stopPropagation(); deleteClass(item.id)}}><FaTrash/></button>
                                </div>
                            )}
                            </div>
                            
                        </div>
                        
                       {editClassId === item.id && (
                         <div className='mt-1'>
                            <form action="" className='flex gap-3' onSubmit={(e)=> {e.preventDefault();handleEditclass(item.id)}}>
                              <input type="text" className='border w-full p-2 mb-1 rounded' value={editClassname} onChange={(e)=> setEditClassname(e.target.value)}/>
                              <button className='p-2 bg-green-400 h-fit rounded my-auto text-white' type='button'><FaUpload/></button>
                            </form>
                        </div>
                       )}
                        <hr />
                    </div>
                  ))}
                </div>
              </div>
            
        </section>
    </div>
  )
}
