import React from 'react'

export const Total = () => {
  return (
    <div className='border lg:w-[31vw] md:w-[35vw] h-fit p-4 rounded-2xl flex flex-col'>
           <h2 className='font-bold text-2xl mb-3'>Student Census</h2>

           <div className='grow flex justify-center'>

           <div className='male border-18 border-blue-600 border-l-blue-500/20 lg:w-53 lg:h-53 p-2 w-58 h-58 rounded-full'>
            <div className='female border-18 border-red-600 border-l-red-500/20 lg:w-40 lg:h-40 w-45 h-45 rounded-full'>
              <div className='lg:w-32 lg:h-32 w-37 h-37 rounded-full flex items-center justify-center'>
               <div className='grid'>
                 <span className='font-bold text-xl'>Total</span>
                 <span className="text-3xl font-bold">500</span>
               </div>
            </div>  
            </div> 
           </div>
           
           </div>
           <div className='flex gap-3 justify-center mt-4'>
             <p className='flex gap-1'><div className='bg-blue-600 w-3 h-3 my-auto'></div> Male</p>
             <p className='flex gap-1'><div className='bg-red-600 w-3 h-3 my-auto'></div> Female</p>
           </div>
          </div>
  )
}
