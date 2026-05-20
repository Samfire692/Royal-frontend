import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';
import { FirstTermResult } from './Result/FirstTermResult';
import { SecondTermResult } from './Result/SecondTermResult';
import { ThirdTermResult } from './Result/ThirdTermResult';
import { FaSpinner } from 'react-icons/fa';

export const TeachInsertResult = () => {
  const [activeState, setActivestate] = useState("firstTerm");
  const [currentSession, setCurrentSession] = useState(""); // Holds the active year (e.g., "2025/2026")
  const [liveTerm, setLiveTerm] = useState("First Term"); // Holds the active term status for locking
  const [loading, setLoading] = useState(false);

  const fetchActiveTimeline = async () => {
    setLoading(true);
    try {
      // Fetch the absolute latest session and term config set by the admin
      const { data, error } = await supabase
        .from("royal_session")
        .select("session_year, session_term")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const activeConfig = data[0];
        setCurrentSession(activeConfig.session_year);
        setLiveTerm(activeConfig.session_term);

        // Auto-set the active tab to match whatever the Admin opened
        if (activeConfig.session_term === "First Term") setActivestate("firstTerm");
        if (activeConfig.session_term === "Second Term") setActivestate("secondTerm");
        if (activeConfig.session_term === "Third Term") setActivestate("thirdTerm");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Configuration Error",
        text: "Could not sync active school term: " + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveTimeline();
  }, []);

  // Structural Lockout logic mapping
  const isSecondTermLocked = liveTerm === "First Term";
  const isThirdTermLocked = liveTerm === "First Term" || liveTerm === "Second Term";

  return (
    <div className="relative p-2">
      {/* GLOBAL CONFIG LOADING SPINNER */}
      {loading && (
        <div className='fixed inset-0 bg-white/60 z-[9999] flex items-center justify-center backdrop-blur-[1px]'>
          <div className='flex flex-col items-center gap-2'>
            <FaSpinner className='animate-spin text-blue-600' size={40} />
            <span className='font-bold text-blue-600 animate-pulse'>Syncing Academic Timeline...</span>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className='mb-2 flex justify-between items-center flex-wrap gap-2'>
        <h2 className='text-3xl font-bold text-slate-800'>Insert Result</h2>
        {currentSession ? (
          <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full border border-green-200 shadow-sm flex items-center gap-1.5 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            Active Session: {currentSession} ({liveTerm})
          </span>
        ) : (
          !loading && (
            <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full border border-amber-200 shadow-sm">
              ⚠️ Configuration Missing
            </span>
          )
        )}
      </div>
      <hr className="border-slate-200 mb-4" />

      {/* TERM SWITCHER TABS WITH DYNAMIC ACCESS CONTROL */}
      <div className='bg-blue-600 w-fit p-2 flex gap-2 text-white rounded-2xl my-4 shadow-md'>
        <button 
          className={`px-4 py-1.5 rounded-xl font-medium transition-all ${
            activeState === "firstTerm" ? "bg-white text-blue-600 shadow-sm" : "hover:bg-blue-500"
          }`} 
          onClick={() => setActivestate("firstTerm")}
        >
          First Term
        </button>
        
        <button 
          disabled={isSecondTermLocked}
          className={`px-4 py-1.5 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            activeState === "secondTerm" ? "bg-white text-blue-600 shadow-sm" : "hover:bg-blue-500"
          }`} 
          onClick={() => setActivestate("secondTerm")}
        >
          Second Term
        </button>
        
        <button 
          disabled={isThirdTermLocked}
          className={`px-4 py-1.5 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            activeState === "thirdTerm" ? "bg-white text-blue-600 shadow-sm" : "hover:bg-blue-500"
          }`} 
          onClick={() => setActivestate("thirdTerm")}
        >
          Third Term
        </button>
      </div>

      {/* RENDER VIEW WINDOW AND FORWARD SYNCED RUNTIME SESSION STRING */}
      <div className="mt-4 border border-slate-100 rounded-2xl p-2 bg-slate-50/30">
        {activeState === "firstTerm" && (
          <FirstTermResult targetYear={currentSession} />
        )}

        {activeState === "secondTerm" && (
          <SecondTermResult targetYear={currentSession} />
        )}

        {activeState === "thirdTerm" && (
          <ThirdTermResult targetYear={currentSession} />
        )}
      </div>
    </div>
  );
};