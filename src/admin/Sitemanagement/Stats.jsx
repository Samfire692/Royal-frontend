import React from 'react'

export const Stats = () => {
  return (
    <div>
        <div>
            <h2 className='font-bold text-xl'>Stats</h2>
        </div>

        <form action="" >
           <div className='grid lg:grid-cols-3 lg:gap-4'>
              <div className='mb-2'>
                <label htmlFor="">Years of Excellence :</label>
                <input type="text" className='border h-9 p-3 w-full rounded'/>
              </div>

              <div className='mb-2'>
                <label htmlFor="">Exam Pass Rate :</label>
                <input type="text" className='border h-9 p-3 w-full rounded'/>
              </div>

              <div className='mb-2'>
                <label htmlFor="">Graduated Students :</label>
                <input type="text" className='border h-9 p-3 w-full rounded'/>
              </div>
           </div>

            <div>
                <button className='w-full py-2 bg-blue-600 text-white rounded-xl'>Upload</button>
            </div>
        </form>
    </div>
  )
}
