import React from 'react'
import { Hero } from './Home/Hero'
import { About } from './Home/About'
import { Facilities } from './Home/Facilities'

export const Home = () => {
  return (
    <div className='pt-2 px-1 mt-4 lg:mt-0 flex flex-col gap-6'>
       <Hero/>
       <About/>
       <Facilities/>
    </div>
  )
}
