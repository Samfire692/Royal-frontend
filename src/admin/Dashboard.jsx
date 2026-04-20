import React from 'react'
import { FaUserGraduate, FaChalkboardTeacher, FaUserCheck, FaChalkboard, FaUser } from 'react-icons/fa'
import { Form } from './Dashboard/Form'
import { Attendance } from './Dashboard/Attendance'
import { Birthday } from './Dashboard/Birthday'
import { useState } from 'react'
import { useEffect } from 'react'
import CountUp from 'react-countup';
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'
import { Dashboards } from './Dashboard/Dashboards'

export const Dashboard = () => {

  
  return (
    <div className='text-black pb-2'>
      <div className='mb-2'>
        <h2 className='text-3xl font-bold'>Dashboard</h2>
      </div><hr />
     <Dashboards/>

      <section id='formTotal'>
         <div className='formTotal flex flex-col md:flex-row gap-3'>
            <Form/>
          <Attendance/>
         </div>
      </section>

    </div>
  )
}
