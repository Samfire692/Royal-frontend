import React from 'react'
import { useState , useEffect} from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import { FaSpinner } from 'react-icons/fa';

export const MissionVision = () => {
  
    const [loading, setLoading]= useState(false)
    const [mission, setMission]= useState("");
    const [vision, setVision] = useState("");
    const [motto, setMotto]= useState("");
    const [eventNote, setEventnote]= useState("");
    const [eventDay, setEventday] = useState("");
    const [eventMonth, setEventmonth]= useState("");
    const [eventYear, setEventyear]= useState("");
    const [data, setData]= useState([]);
    
    const submitData = async (e) => {
        e.preventDefault();

        // 1. Pack only what is NOT empty (Selective Update)
        const updates = {};
        if (mission) updates.mission = mission;
        if (vision) updates.vision = vision;
        if (motto) updates.motto = motto;
        if (eventNote) updates.event_note = eventNote;
        if (eventDay) updates.event_day = eventDay;
        if (eventMonth) updates.event_month = eventMonth;
        if (eventYear) updates.event_year = eventYear;

        // 2. Check if anything was typed at all
        if (Object.keys(updates).length === 0) {
            return Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "At least one field is required to update"
            });
        }

        // 3. If we reach here, we are good to go
        setLoading(true);
        const { error } = await supabase
            .from("schoolabout")
            .update(updates) // Only sends the columns that have values
            .eq("id", 1);

        setLoading(false);

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error Uploading",
                text: error.message
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Updated Successfully"
            });
        }
    };

    const fetchData = async (e)=> {
        const {data, err} = await supabase
        .from("schoolabout")
        .select("*")
        .eq("id", 1)
        .single();

       if (data) {
            setMission(data.mission);
            setVision(data.vision);
            setMotto(data.motto);
            setEventnote(data.event_note);
            setEventday(data.event_day);
            setEventmonth(data.event_month);
            setEventyear(data.event_year);
        }
    }

    useEffect(()=> {
        fetchData();
    }, [])


  return (
    <div>
        <div className='mb-1.5'>
            <h2 className='text-xl font-bold'>School About & Events</h2>
        </div><hr className='w-52'/>

        <section id='cards'>
                <div className='cards py-2 '>
              <form className=''>
                <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-3'>
              <div className=''>
                <h2 className='font-bold mb-2'>Mission</h2>
                    <textarea name="" id="" className='border h-30 w-full rounded-xl text-black p-2' onChange={(e)=> setMission(e.target.value)} value={mission}></textarea>
              </div>

               <div className=''>
                <h2 className='font-bold mb-2'>Vision</h2>
                    <textarea name="" id="" className='border h-30 w-full rounded-xl text-black p-2' onChange={(e)=> setVision(e.target.value)} value={vision}></textarea>
              </div>

               <div className=''>
                <h2 className='font-bold mb-2'>Motto</h2>
                    <textarea name="" id="" className='border h-30 w-full rounded-xl text-black p-2' onChange={(e)=> setMotto(e.target.value)} value={motto}></textarea>
              </div>

               <div className=''>
                <h2 className='font-bold mb-2'>Upcoming Events</h2>
                   <div className='flex flex-wrap gap-3'>
                      <input type="text" placeholder='Events note . . .' className='border p-2 rounded-xl w-full'  onChange={(e)=> setEventnote(e.target.value)} value={eventNote}/>
                      <div className='flex gap-3'>
                        <input type="number" placeholder='Day' className='border p-2 rounded-xl' min="1" max="31" onChange={(e)=> setEventday(e.target.value)} value={eventDay}/>
                        <select className='border p-2 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer transition-all' onChange={(e)=> setEventmonth(e.target.value)} value={eventMonth}>
                        <option value="" disabled>Select Month</option>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                       </select>

                      <input type="number" placeholder='Year' className='border p-2 rounded-xl w-24' min="2026" max="2030" onChange={(e)=> setEventyear(e.target.value)} value={eventYear}/>
                      </div>
                   </div>
              </div>
              </div>

              <div className='mt-2 flex justify-center'>
                <button className='p-3 bg-blue-500 text-white rounded-xl w-50' onClick={submitData}>{loading ? <FaSpinner className='mx-auto animate-spin'/> : "Update"}</button>
              </div>
              </form>

            </div>
        </section>
    </div>
  )
}
