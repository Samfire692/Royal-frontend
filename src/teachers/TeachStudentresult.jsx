import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { FirstTermViewResult } from './Result/FirstTermViewResult'
import { SecondTermViewResult } from './Result/SecondTermViewResult'
import { ThirdTermViewResult } from './Result/ThirdTermViewResult'

export const TeachStudentresult = () => {
    const navigate = useNavigate();
    const [activeState, setActivestate] = useState("firstTerm");

    return (
        <div className="p-4 lg:p-6">
            {/* Header with Back Button */}
            <div className='flex items-center gap-4 mb-4'>
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <FaArrowLeft className="text-xl" />
                </button>
                <h2 className='text-3xl font-bold text-slate-800'>Student's Result</h2>
            </div>
            
            <hr className="mb-6" />

            {/* Term Toggles */}
            <div className='bg-blue-600 w-fit p-1.5 flex gap-1 text-white rounded-2xl mb-8 shadow-md'>
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

            {/* Result Content Area */}
            <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                {activeState === "firstTerm" && <FirstTermViewResult />}
                {activeState === "secondTerm" && <SecondTermViewResult />}
                {activeState === "thirdTerm" && <ThirdTermViewResult />}
            </div>
        </div>
    )
}