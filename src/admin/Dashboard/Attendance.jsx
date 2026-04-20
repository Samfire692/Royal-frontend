import React, { useState } from 'react'
import { Calendar1 } from 'lucide-react';
import { FaArrowRight, FaChevronLeft } from 'react-icons/fa';

export const Attendance = () => {

  const [week, setWeeks]= useState(1)
  const [daysIndex, setDaysindex] = useState(0)
  const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const nextday = ()=>{
    if(daysIndex < day.length - 1){
      setDaysindex(daysIndex + 1)
    }else if(week < 12){
      setWeeks(week + 1);
      setDaysindex(0);
    }
  }

  const prevday = ()=>{
    if(daysIndex > 0){
      setDaysindex(daysIndex -  1)
    }else if(week > 1){
      setWeeks(week - 1);
      setDaysindex(4)
    }
  }

    return (
    <div className='shadow-sm w-full rounded-2xl p-3.5 cursor-pointer group' style={{boxShadow:"0px 0px 3px royalblue"}}>
       <div className='flex justify-between'>
        <h2 className='font-bold text-2xl text-blue-900'>Daily Check-In</h2>
        <button className='w-10 h-10 p-2 rounded-full bg-blue-200/60 group-hover:translate-x-1.5 -translate-y-1.5 transition-all'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m5.636 19.778l-1.414-1.414L15.657 6.93h-5.586v-2h9v9h-2V8.343z" className='text-blue-700'/></svg></button>
       </div>

      <div className='flex flex-col justify-center place-items-center h-50'>       
        <div className='flex gap-2'>
          <button className='h-fit my-auto shadow-sm shadow-slate-600 rounded-full p-1.5' onClick={prevday}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="lightgrey" strokeDasharray="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l7 -7M8 12l7 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="12;0"/></path></svg></button>

          <div className='shadow shadow-slate-500/50 h-40 flex flex-col px-2 py-2 min-w-50 text-center rounded-2xl'>
            <span className='font-bold text-slate-500 mt-7'>WEEK {week}</span>
            <h3 className='text-2xl font-bold text-slate-600'>{day[daysIndex]}</h3>
            <div className='flex mx-auto gap-4 mt-3'>
              <button className='focus:bg-green-600 border w-8 h-8 rounded-full mx-auto'>A</button>
              <button className='focus:bg-green-600 border w-8 h-8 rounded-full mx-auto'>P</button>
            </div>
          </div>

          <button className='h-fit my-auto shadow-sm shadow-slate-600 rounded-full p-1.5' onClick={nextday}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="lightgrey" strokeDasharray="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-7 -7M16 12l-7 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="12;0"/></path></svg></button>

        </div>
      </div>

    </div>
  )
}
