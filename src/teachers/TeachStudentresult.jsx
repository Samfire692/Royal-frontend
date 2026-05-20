import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';
import { FaArrowLeft, FaCalendarAlt, FaSpinner } from 'react-icons/fa'
import { FirstTermViewResult } from './Result/FirstTermViewResult'
import { SecondTermViewResult } from './Result/SecondTermViewResult'
import { ThirdTermViewResult } from './Result/ThirdTermViewResult'

export const TeachStudentresult = () => {
    const navigate = useNavigate();
    const [activeState, setActivestate] = useState("firstTerm");
    const [sessions, setSessions] = useState([]); // List of all historical sessions
    const [selectedSession, setSelectedSession] = useState(""); // The session being viewed
    const [loading, setLoading] = useState(false);

    // Fetch all unique sessions from your setup table
    const fetchSessionsConfig = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("royal_session")
                .select("session_year, session_term")
                .order("created_at", { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                // Get unique sessions just in case there are duplicates across term changes
                const uniqueSessions = [...new Set(data.map(item => item.session_year))];
                setSessions(uniqueSessions);
                
                // Default to the absolute latest active session set by Admin
                setSelectedSession(uniqueSessions[0]);

                // Optional: Auto-align tabs to the active term if checking current results
                const currentActiveConfig = data[0];
                if (currentActiveConfig.session_term === "First Term") setActivestate("firstTerm");
                if (currentActiveConfig.session_term === "Second Term") setActivestate("secondTerm");
                if (currentActiveConfig.session_term === "Third Term") setActivestate("thirdTerm");
            }
        } catch (error) {
            Swal.fire("Error", "Failed to sync calendar timelines: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionsConfig();
    }, []);

    return (
        <div className="p-4 lg:p-6 relative">
            {/* Loading Overlay */}
            {loading && (
                <div className='fixed inset-0 bg-white/60 z-[9999] flex items-center justify-center backdrop-blur-[1px]'>
                    <FaSpinner className='animate-spin text-blue-600' size={40} />
                </div>
            )}

            {/* Header with Back Button & Session Picker */}
            <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
                <div className='flex items-center gap-4'>
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <FaArrowLeft className="text-xl text-slate-700" />
                    </button>
                    <h2 className='text-3xl font-bold text-slate-800'>Student's Result</h2>
                </div>

                {/* HISTORICAL SESSION PICKER */}
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                    <FaCalendarAlt className="text-blue-600 text-sm" />
                    <label className="text-xs font-bold text-slate-500 uppercase">Academic Year:</label>
                    <select 
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        className="bg-transparent font-semibold text-sm text-slate-700 outline-none cursor-pointer"
                    >
                        {sessions.map((year, idx) => (
                            <option key={idx} value={year}>{year} {idx === 0 ? "(Current)" : ""}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <hr className="mb-6 border-slate-200" />

            {/* Term Toggles */}
            <div className='bg-blue-600 w-fit p-1.5 flex gap-1 text-white rounded-2xl mb-6 shadow-md'>
                <button 
                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${activeState === "firstTerm" ? "bg-white text-blue-600 shadow-sm" : "hover:bg-blue-500"}`} 
                    onClick={() => setActivestate("firstTerm")}
                >
                    First Term
                </button>
                <button 
                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${activeState === "secondTerm" ? "bg-white text-blue-600 shadow-sm" : "hover:bg-blue-500"}`} 
                    onClick={() => setActivestate("secondTerm")}
                >
                    Second Term
                </button>
                <button 
                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${activeState === "thirdTerm" ? "bg-white text-blue-600 shadow-sm" : "hover:bg-blue-500"}`} 
                    onClick={() => setActivestate("thirdTerm")}
                >
                    Third Term
                </button>
            </div>

            {/* Result Content Area - Passing down selectedSession dynamically */}
            <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                {activeState === "firstTerm" && <FirstTermViewResult targetYear={selectedSession} />}
                {activeState === "secondTerm" && <SecondTermViewResult targetYear={selectedSession} />}
                {activeState === "thirdTerm" && <ThirdTermViewResult targetYear={selectedSession} />}
            </div>
        </div>
    )
}