import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient';

export const News = () => {
  const [fetchNews, setFetchnews]= useState([]);

  const fetchData = async()=> {
   
    const {data,error} = await supabase
    .from("news")
    .select("*")
    .order("created_at", {ascending:false})
    .limit(4)

    if(error){
        console.log("error" + error.message)
    }else{
        setFetchnews(data);
    }
  }

  useEffect(()=> {
    fetchData();
  },[])

  return (
    <div className='pb-3'>
        <div>
            <h2 className='font-bold text-blue-900 text-2xl px-3'>News</h2>
        </div><br />

        <section id=''>
           <div className='grid md:grid-cols-2 gap-8 justify-items-center p-2 max-w-5xl mx-auto shadow-sm shadow-slate-500 rounded-2xl'>
              {fetchNews.map((item)=> (
                <div key={item.id} className='shadow-sm w-full shadow-slate-600 flex gap-1 py-3 px-2 rounded-2xl justify-around'>
                    <img src={item.image_url} alt="" className='min-w-30 max-h-40 rounded-2xl my-auto'/>
                    <div className='text-center my-auto'>
                        <span className=''>{item.club}</span>
                        <h3 className='font-bold text-xl w-50 text-blue-500'>{item.title}</h3>
                        <p className='w-45 max-h-12 overflow-y-hidden mx-auto'>{item.content}</p>
                        <span className=''> {new Date(item.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                        })}</span><br />
                        <button className='mt-2 p-2 bg-blue-600 rounded-xl text-white'>Read more</button>
                    </div>
                </div>
            ))}
           </div>
        </section>
    </div>
  )
}
