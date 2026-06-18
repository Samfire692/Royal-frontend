import React from 'react'
import profilepic from './assets/Images/admin profile pic.jfif'
import { useState, useEffect } from 'react'

export const Search = () => {
    const [search, setSearch] = useState(false);
    const [nameToggle, setNameToggle] = useState(false);
    const [displayName, setDisplayName] = useState("");

   useEffect(() => {
    // Function to safely get name from a JSON string in localStorage
    const getNameFromStorage = (key) => {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                // Adjust "full_name" or "name" based on your actual database column names
                return parsed.full_name || parsed.name || parsed.email; 
            } catch (e) {
                return storedData; // If it's not JSON, return as is
            }
        }
        return null;
    };

    // ✅ Check for any of the profiles you have in your screenshot
    const adminName = getNameFromStorage('AdminProfile');
    const teacherName = getNameFromStorage('TeacherProfile');
    const userName = getNameFromStorage('userProfile');

    // Set the first one that exists
    const finalName = adminName || teacherName || userName;

    if (finalName) {
        setDisplayName(finalName);
    } else {
        setDisplayName("User");
    }
}, []);

    return (
        <div className='flex lg:w-[93vw] w-full gap-2 justify-between'>
            <div className='my-auto'>
                {search && (
                    <input 
                        type="text" 
                        className='border h-9 rounded-lg lg:min-w-2xl p-2 transition-all outline-none focus:border-blue-500' 
                        placeholder="Search for something..." 
                        autoFocus
                    />
                )}
            </div>

            <div className='flex gap-2 items-center relative'>
                {/* SEARCH TOGGLE */}
                <button 
                    className='bg-slate-300/20 p-1.5 rounded-full hover:bg-slate-300/40 transition-colors' 
                    onClick={() => setSearch(!search)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9.5 4a6.5 6.5 0 0 1 6.5 6.5c0 1.62-.59 3.1-1.57 4.23l5.65 5.65l-.71.71l-5.65-5.65A6.47 6.47 0 0 1 9.5 17A6.5 6.5 0 0 1 3 10.5A6.5 6.5 0 0 1 9.5 4m0 1A5.5 5.5 0 0 0 4 10.5A5.5 5.5 0 0 0 9.5 16a5.5 5.5 0 0 0 5.5-5.5A5.5 5.5 0 0 0 9.5 5" />
                    </svg>
                </button>

                {/* PROFILE SECTION */}
                <div className='shadow-sm border border-slate-100 rounded-xl p-1 bg-white flex gap-2 items-center'>
                    <img src={profilepic} alt="User Profile" className='w-9 h-9 shadow-sm rounded-full object-cover'/>
                    <button 
                        className={`transition-transform duration-300 ${nameToggle ? "rotate-180" : ""}`} 
                        onClick={() => setNameToggle(!nameToggle)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" strokeDasharray="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-5 -5M12 15l5 -5">
                                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="10;0" />
                            </path>
                        </svg>
                    </button>

                    {/* DYNAMIC DROPDOWN NAME */}
                    {nameToggle && (
                        <div className='absolute right-0 top-12 z-50'>
                            <p className='bg-blue-600 text-white p-2 px-4 rounded-lg font-semibold shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-top-2 duration-200'>
                                {displayName}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}