import React from 'react'

export const Attendance = () => {
  return (
    <div className='border lg:w-[50vw] h-[49vh] p-5 rounded-2xl bg-white shadow-sm flex flex-col'>
  <div className='flex justify-between items-center mb-4'>
    <div>
      <h2 className='font-bold text-2xl'>Weekly Attendance Trend</h2>
      <p className='text-sm text-gray-500'>Monday, Mar 16 - Friday, Mar 20</p>
    </div>
    <div className='flex gap-4'>
       <div className='flex items-center gap-2 text-sm'><span className='w-3 h-3 bg-blue-600 rounded-full'></span> Present</div>
       <div className='flex items-center gap-2 text-sm'><span className='w-3 h-3 bg-blue-200 rounded-full'></span> Absent</div>
    </div>
  </div>

  <div className='grow overflow-hidden rounded-xl bg-slate-50'>
    <img 
      src="https://www.highcharts.com/samples/graphics/stock-area.png" 
      alt="Attendance Graph" 
      className='w-full h-full object-cover opacity-80 mix-blend-multiply'
    />
  </div>
</div>
  )
}
