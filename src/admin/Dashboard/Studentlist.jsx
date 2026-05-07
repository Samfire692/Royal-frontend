import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2';
import profilepic from '/src/assets/Images/admin profile pic.jfif';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

export const Studentlist = () => {

    const [studentInfo, setStudentinfo] = useState([]); // Changed name for clarity
    const [searchTerm, setSearchTerm] = useState(""); // New state for search
    const [totalStudent, setTotalstudent] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchInfo = async () => {
        try {
            const { data, count, error } = await supabase
                .from("studentsignup")
                .select("*", { count: 'exact' })
                .order("created_at", { ascending: false })

            if (error) throw error;
            setStudentinfo(data);
            setTotalstudent(count)
            setLoading(false);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message.includes("Fetch") ? "Check Internet Connection !" : error.message
            })
        }
    }

    const blockAdmin = async (id, status) => {
        const newStatus = status === 'blocked' ? 'active' : 'blocked';
        const actionText = newStatus === 'active' ? 'Unblock' : 'Block';

        const blockResult = await Swal.fire({
            icon: "warning",
            title: `${actionText} Student?`, // Changed to Student
            text: `Are you sure you want to ${actionText.toLowerCase()} this account?`,
            showCancelButton: true,
            confirmButtonColor: newStatus === 'active' ? '#22c55e' : '#ef4444',
            confirmButtonText: `Yes, ${actionText}!`
        })

        if (blockResult.isConfirmed) {
            try {
                const { error } = await supabase
                    .from("studentsignup")
                    .update({ status: newStatus })
                    .eq("id", id)
                
                await fetchInfo();

                Swal.fire(`${actionText}ed!`, `User has been ${newStatus}.`, "success");
            } catch (error) {
                Swal.fire({ icon: "error", title: "Error", text: error.message })
            }
        }
    }

    useEffect(() => {
        fetchInfo()
    }, [])

    // FILTER LOGIC: Search by Name or Special ID
    const filteredStudents = studentInfo.filter((student) =>
        student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.special_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className='h-screen flex justify-center place-items-center flex-col'>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg>
                <p className='mt-2'>Fetching data . . .</p>
            </div>
        )
    }

    return (
        <div>
            <div className='py-2.5 flex gap-3 mb-3'>
                <div className='my-auto shadow w-10 h-10 rounded-full text-xl p-2 bg-slate-300'>
                    <button onClick={() => navigate(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path strokeDasharray="16" d="M19 12h-13.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0" /></path><path strokeDasharray="10" strokeDashoffset="10" d="M5 12l5 5M5 12l5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.2s" to="0" /></path></g></svg>
                    </button>
                </div>

                <div className='flex w-full relative'>
                    <input 
                        type="text" 
                        className='border w-full h-12 border-slate-400 px-12 rounded-4xl outline-none focus:border-blue-500' 
                        placeholder='Search by name or ID' 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Binds input to search
                    />
                    <span className='absolute py-2 px-1 mx-2 my-1 text-slate-400 border-r h-10'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path strokeDasharray="40" d="M10.76 13.24c-2.34 -2.34 -2.34 -6.14 0 -8.49c2.34 -2.34 6.14 -2.34 8.49 0c2.34 2.34 2.34 6.14 0 8.49c-2.34 2.34 -6.14 2.34 -8.49 0Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="40;0" /></path><path strokeDasharray="14" stroke-dashoffset="14" d="M10.5 13.5l-7.5 7.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" to="0" /></path></g></svg>
                    </span>
                </div>

                <div className='my-auto'>
                    <img src={profilepic} alt="" className='shadow-sm shadow-slate-400 w-12 max-h-11 rounded-full' />
                </div>
            </div><hr className='text-slate-300' />

            <section id='displayAdmin'>
                <div className='displayAdmin p-3'>
                    <h2 className='text-3xl flex gap-1.5'>
                        <span className='text-blue-500 font-bold'>
                            <CountUp start={0} end={filteredStudents.length} duration={1} />
                        </span>
                        <span className='italic'>Students</span>
                    </h2>

                    <div className='grid lg:grid-cols-3 mt-5 gap-4'>
                        {filteredStudents.map((student) => (
                            <div key={student.id} className={`shadow-sm w-full shadow-slate-500 rounded-4xl mx-auto p-3 transition-all ${student.status === 'blocked' ? 'opacity-70 bg-red-50' : ''}`}>
                                <div>
                                    <div className='flex justify-between'>
                                        <img src={student.profile_pic_url || profilepic} alt="" className='w-23 h-23 object-cover rounded-full' />
                                        <button onClick={() => blockAdmin(student.id, student.status)} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors h-fit my-auto ${student.status === 'blocked' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                        >
                                            {student.status === 'blocked' ? 'Unblock' : 'Block'}
                                        </button>
                                    </div>
                                    <p className='mt-4 text-xl'>{student.full_name}</p>
                                    <p className='text-slate-500/80 mt-2'>{student.special_id}</p>
                                </div>

                                <div className='flex justify-between my-4'>
                                    <div className='grid'>
                                        <span className='text-slate-400'>Role</span>
                                        <span>{student.role}</span>
                                    </div>

                                    <div className='grid'>
                                        <span className='text-slate-400'>Date Joined</span>
                                        <span>{new Date(student.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className=''>
                                    <div className='flex mb-3 gap-2'>
                                        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path strokeDasharray="66" d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0" /></path><path strokeDasharray="24" stroke-dashoffset="24" d="M3 6.5l9 5.5l9 -5.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.3s" to="0" /></path></g></svg></span>
                                        <span>{student.email}</span>
                                    </div>

                                    <div className='flex gap-2'>
                                        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><path fill="none" stroke="currentColor" strokeDasharray="62" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 3c0.5 0 2.5 4.5 2.5 5c0 1 -1.5 2 -2 3c-0.5 1 0.5 2 1.5 3c0.39 0.39 2 2 3 1.5c1 -0.5 2 -2 3 -2c0.5 0 5 2 5 2.5c0 2 -1.5 3.5 -3 4c-1.5 0.5 -2.5 0.5 -4.5 0c-2 -0.5 -3.5 -1 -6 -3.5c-2.5 -2.5 -3 -4 -3.5 -6c-0.5 -2 -0.5 -3 0 -4.5c0.5 -1.5 2 -3 4 -3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="62;0" /></path></svg></span>
                                        <span>{student.phone_number || "no phone added yet"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}