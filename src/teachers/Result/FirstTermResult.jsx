import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import profilepic from '../../assets/Images/admin profile pic.jfif'
import { FaGraduationCap , FaFile, FaPlus} from 'react-icons/fa';

export const FirstTermResult = () => {

    const [studentArray, setStudentarray]= useState([]);
    const [classArray, setClassarray]= useState([]);
    const [add, setAdd] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [scores, setScores] = useState({});

   const fetchStudents = async (classId) => {
  if (!classId) return;
  try {
    const { data, error } = await supabase
      .from("studentsignup")
      .select("*")
      .eq("class_id", classId) // ONLY get students for this class!
      .order("full_name", { ascending: true });

    if (error) throw error;
    console.log("Students found:", data)
    setStudentarray(data);
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};

       const fetchClasses = async()=>{
        const user = JSON.parse(localStorage.getItem('TeacherProfile'));
        const currentTeacherId = user?.id;

        console.log("Searching for Teacher ID:", currentTeacherId);

        // console.log("What is in storage?", localStorage.getItem('TeacherProfile'));

        if(!currentTeacherId) return;
        try{
          const {data, error} = await supabase
          .from("teacherchooseSubject")
          .select(`
           id, class_id, subject_id,royalclassrooms(class_name),subjects(subject_name)`) 
          .eq('teacher_id', currentTeacherId)
    
          if(error) throw error;
          setClassarray(data);
        }catch(error){
          if(error.message.includes("Fetch")){
            Swal.fire({
              icon:"error",
              title:"Connection Lost",
              text:"No Internet Connection !"
            })
          }else{
            Swal.fire({
              icon:"error",
              title:"Error",
              text:error.message
            })
          }
        }finally{
    
        }
      }

      useEffect(()=> {
        fetchClasses();
      }, [])
  return (
   <div>
      <div className=''>
        <h2 className='text-xl font-bold'>First Term</h2>
      </div><hr className='w-23'/>

      <div className='mt-2 px-2'>
          <h2 className='uppercase font-bold mb-2'>Choose Classes & Subjects</h2>
           <div className='flex gap-3'>
            {classArray.map((items)=> (
              <div key={items.id} className='grid'>
                <small className='font-bold uppercase text-slate-400 italic mx-auto'>{items.royalclassrooms?.class_name}</small>
               <button onClick={() => {
                setSelectedClass(items.class_id);
                setSelectedSubject(items.subjects?.subject_name);
                fetchStudents(items.class_id); // Pass the class_id here!
                }} className={`border px-3 h-9 mt-1 rounded-xl transition-all ${selectedClass === items.class_id ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-400'
                }`}>{items.subjects?.subject_name} </button>
              </div>
            ))}
           </div>
      </div>

      <div className='mt-5 flex gap-2 flex-col pb-6 lg:pe-3'>
        <div className='bg-slate-100 p-2 my-2 rounded text-xs font-mono'>
  <p>Locked Class ID: {selectedClass || "None"}</p>
  <p>Locked Subject: {selectedSubject || "None"}</p>
</div>
        {studentArray.map((item)=> (
          <div key={item.id} className='shadow-sm shadow-slate-500/60 p-2 rounded-xl'>
            <div className='flex justify-between gap-3'>
            <div className='flex gap-4 w-md justify-between'>
              <img src={item.profile_pic_url || profilepic } className='w-12 h-12 rounded-full' alt="" />
              <span className='my-auto text-blue-500 font-semibold'>{item.full_name}</span>
              <small className='text-slate-400 my-auto'>{item.special_id}</small>
            </div>

            <div>
                <button className='text-slate-400' onClick={()=> setAdd(add === item.id ? "" : item.id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="16;0"/></path><path stroke-dashoffset="16" d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.5s" to="0"/></path></g></svg></button>
            </div>
            </div>

           {add === item.id && (
            <form className='mt-2'>
             <div className='flex gap-4'>
               <div className=''>
                <label htmlFor="">Subject Test name:</label>
                <input type="text"  className='border h-8 mx-1 text-center rounded w-10' maxLength={3}/>
              </div>

              <div className=''>
                <label htmlFor="">Subject Exam name:</label>
                <input type="text"  className='border h-8 mx-1 text-center rounded w-10' maxLength={3}/>
              </div>
             </div>

             <div className='flex justify-end mt-3'>
              <button className='bg-blue-500 w-30 h-11 text-white rounded-xl'>Submit</button>
             </div>
           </form>
           )}

           <div className='flex justify-between md:me-4 py-2 shadow-sm mt-2 rounded-xl bg-slate-200/50'>
               <div className='flex gap-2 text-slate-400 justify-around w-sm'>
                 <button className='mb-1 flex font-bold py-1 gap-1'><FaGraduationCap size={20} className='my-auto'/> View Profile</button>
                <button className='mb-1 flex font-bold py-1 gap-1'><FaFile size={18} className='my-auto'/> Results</button>
               </div>

               <div className='w-30 justify-end flex md:justify-around gap-3 my-auto'>
               <a href="" className='text-slate-500'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="66" d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0"/></path><path stroke-dasharray="24" stroke-dashoffset="24" d="M3 6.5l9 5.5l9 -5.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.3s" to="0"/></path></g></svg></a>

               <a href="" className='text-slate-500'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="none" stroke="currentColor" stroke-dasharray="62" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 3c0.5 0 2.5 4.5 2.5 5c0 1 -1.5 2 -2 3c-0.5 1 0.5 2 1.5 3c0.39 0.39 2 2 3 1.5c1 -0.5 2 -2 3 -2c0.5 0 5 2 5 2.5c0 2 -1.5 3.5 -3 4c-1.5 0.5 -2.5 0.5 -4.5 0c-2 -0.5 -3.5 -1 -6 -3.5c-2.5 -2.5 -3 -4 -3.5 -6c-0.5 -2 -0.5 -3 0 -4.5c0.5 -1.5 2 -3 4 -3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="62;0"/></path></svg></a>
            </div>
           </div>

          </div>
        ))}
      </div>

    </div>
  )
}
