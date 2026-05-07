import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';
import { FirstTermResult } from './Result/FirstTermResult';
import { SecondTermResult } from './Result/SecondTermResult';
import { ThirdTermResult } from './Result/ThirdTermResult';

export const TeachInsertResult = () => {

  const [activeState, setActivestate] = useState("firstTerm");
  return (
   <div>
    <div className='mb-2'>
         <h2 className='text-3xl font-bold'>Insert Result</h2>
    </div><hr />

     <div className='bg-blue-600 w-fit p-3 flex gap-3 text-white rounded-2xl my-4'>
       <button className={`px-2 py-1 rounded border-r-2 ${activeState === "firstTerm" ? "bg-white text-blue-600" : ""}`} onClick={()=> setActivestate("firstTerm")}>First Term</button>
       <button className={`px-2 py-1 rounded border-r-2 border-l-2 ${activeState === "secondTerm" ? "bg-white text-blue-600" : ""}`} onClick={()=> setActivestate("secondTerm")}>Second Term</button>
       <button className={`px-2 py-1 rounded border-l-2 ${activeState === "thirdTerm" ? "bg-white text-blue-600" : ""}`} onClick={()=> setActivestate("thirdTerm")}>Third Term</button>
     </div>

     <div>
       {activeState === "firstTerm" && (
        <FirstTermResult/>
       )}

       {activeState === "secondTerm" && (
        <SecondTermResult/>
       )}

       {activeState === "thirdTerm" && (
        <ThirdTermResult/>
       )}
     </div>
   </div>
  )
}
