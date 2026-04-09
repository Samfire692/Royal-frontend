import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';
import { useOutletContext } from 'react-router-dom';
import profilepic from '../assets/Images/admin profile pic.jfif'

export const StudentProfile = () => {
    const { user } = useOutletContext();
    const [studentInfo , setStudentinfo] = useState([]);
 
    const fetchInfo = async (studentId) => {
        if (!studentId) return;

        // ✅ UUID is a string, so we don't need Number()
        const { data, error } = await supabase
            .from("studentsignup")
            .select("*")
            .eq("id", studentId);

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message
            });
            setLoading(false);
            return;
        }

        setStudentinfo(data);
    }

    useEffect(() => {
        if (user?.id) {
            fetchInfo(user.id);
        }
    }, [user]);

  return (
    <div className='lg:w-[93vw]'>
       <div className='mb-2'>
        <h2 className='font-bold text-3xl'>Profile</h2>
       </div><hr />

       <section id=''>
         <div>
            {studentInfo.map((info) => (
                <div key={info.id}>
                    <div className='lg:w-[90vw] mx-auto py-2'>
                      <div className='p-4 rounded-2xl bg-purple-400 mt-2 shadow flex lg:flex-row flex-col gap-7'>
                        <div className='flex justify-center lg:justify-start'>
                            <img src={profilepic} alt="" className='w-30 h-30 rounded-full'/>
                        </div>

                       <div className='flex flex-col lg:flex-row lg:gap-7'>
                          <div>
                            <p className='py-2'>Fullname: {info.full_name}</p>
                            <p className='py-2'>Student ID: {info.special_id}</p>
                            <p className='py-2'>Email: {info.email}</p>
                        </div>

                        <div>
                            <p className='py-2'>Role: {info.role}</p>
                            <p className='py-2'>Rank: {info.rank}</p>
                            <p className='py-2'>Status: {info.status}</p>
                        </div>
                       </div>

                      </div>

                    </div>

                </div>
            ))}
         </div>
       </section>
    </div>
  )
}
