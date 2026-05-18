import React, { useState, useEffect } from 'react' // Added useState/useEffect
import { FaUserGraduate, FaChalkboardTeacher, FaUserCheck, FaChalkboard, FaUser } from 'react-icons/fa'
import { Form } from './Dashboard/Form'
import { Attendance } from './Dashboard/Attendance'
import { Birthday } from './Dashboard/Birthday'
import CountUp from 'react-countup';
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'
import { Dashboards } from './Dashboard/Dashboards'
import { Search } from '../Search'
import { Link } from 'react-router-dom'

export const Dashboard = () => {
    // --- NOTIFICATION LOGIC START ---
    const [notifCount, setNotifCount] = useState(0);

    const fetchPendingCount = async () => {
        const { count, error } = await supabase
            .from('teachersignup')
            .select('*', { count: 'exact', head: true })
            .eq('class_teacher_status', 'pending');

        if (!error) setNotifCount(count || 0);
    };

    useEffect(() => {
        fetchPendingCount();

        // Listen for real-time updates so the count changes instantly
        const subscription = supabase
            .channel('admin-notifs')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'teachersignup' }, 
                () => fetchPendingCount()
            )
            .subscribe();

        return () => supabase.removeChannel(subscription);
    }, []);
    // --- NOTIFICATION LOGIC END ---

    return (
        <div className='text-black pb-2'>
            <div className='mb-2 flex justify-between'>
                <h2 className='text-3xl font-bold'>Dashboard</h2>
                
                {/* Bell Link with your SVG preserved */}
                <Link to="/admin/notification" className='my-auto bg-slate-300/40 rounded-full p-1 relative'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="M12 4.5a.5.5 0 0 0-.5-.5a.5.5 0 0 0-.5.5v1.53c-2.25.25-4 2.15-4 4.47v5.91L5.41 18h12.18L16 16.41V10.5c0-2.32-1.75-4.22-4-4.47zM11.5 3A1.5 1.5 0 0 1 13 4.5v.71c2.31.65 4 2.79 4 5.29V16l3 3H3l3-3v-5.5C6 8 7.69 5.86 10 5.21V4.5A1.5 1.5 0 0 1 11.5 3m0 19a2.5 2.5 0 0 1-2.45-2h1.04a1.495 1.495 0 0 0 2.82 0h1.04a2.5 2.5 0 0 1-2.45 2" />
                    </svg>

                    {/* The Red Badge - only shows if count > 0 */}
                    {notifCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                            {notifCount}
                        </span>
                    )}
                </Link>
            </div>
            <hr />
            <Dashboards />

            <section id='formTotal'>
                <div className='formTotal flex flex-col md:flex-row gap-3'>
                    <Form />
                    <Attendance />
                </div>
            </section>
        </div>
    )
}