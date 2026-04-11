import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // Make sure this is imported

export const News = () => {

  const [fetchNews, setFetchnews] = useState([]);
  
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false })
        
  
      if (error) {
        console.log("error" + error.message)
      } else {
        setFetchnews(data);
      }
    }
  
    useEffect(() => {
      fetchData();
    }, [])
  
    // The function to handle the Swal popup
    const handleNewsClick = (item) => {
      const formattedDate = new Date(item.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
  
      Swal.fire({
        title: `<span style="color: #1e3a8a; font-weight: bold;">${item.title}</span>`,
        html: `
          <div style="text-align: left;">
            <p style="color: #64748b; font-size: 0.8rem; margin-bottom: 10px;">${formattedDate} | ${item.club || 'General News'}</p>
            <div style="font-size: 1rem; line-height: 1.6; color: #334155;">
              ${item.content}
            </div>
          </div>
        `,
        imageUrl: item.image_url,
        imageAlt: item.title,
        imageWidth: 400,
        imageHeight:300,
        confirmButtonText: 'Close',
        confirmButtonColor: '#1d4ed8', // Matches your blue-700/800
        showCloseButton: true,
        customClass: {
          popup: 'rounded-3xl',
          image:"object-contain"
        }
      });
    };

  return (
    <div>
       <div className='lg:mt-6 px-3'>
      <section id=''>
        <div>
           <div className='mb-12 text-center md:text-left'>
          <h3 className='text-3xl md:text-4xl font-black text-blue-900 text-start mb-2'>News</h3>
          <div className='w-20 h-1.5 bg-blue-600 rounded-full mb-6'></div>
        </div>

          <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-3 justify-items-center news'>
            {fetchNews.map((item) => (
              <div 
                key={item.id} 
                className='overflow-hidden' 
                onClick={() => handleNewsClick(item)} // Trigger Swal here
              >
                <div className='flex cursor-pointer'>
                  <img src={item.image_url} alt="" className='h-70 w-100 object-cover rounded-2xl' />
                  <div className='absolute text-white p-3'>
                    <p className='my-auto text-sm w-full'>
                      {new Date(item.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    
                    <div className='mt-30 mb-2 newsCont'>
                      <h2 className='text-2xl'>{item.title}</h2>
                      <p className='max-w-90 h-13 overflow-y-hidden'>{item.content}</p>
                      <small className='mt-3 block'>{item.club}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </div>
  )
}
