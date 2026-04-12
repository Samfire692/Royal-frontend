import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const News = () => {
  const [fetchNews, setFetchnews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4); // Fetch more for a better slider experience

    if (error) {
      console.log("error" + error.message)
    } else {
      setFetchnews(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleNewsClick = (item) => {
    Swal.fire({
  title: `<span style="color: #1e3a8a; font-weight: 900; text-transform: uppercase;">${item.title}</span>`,
  html: `<div style="text-align: left; line-height: 1.8; color: #475569;">${item.content}</div>`,
  imageUrl: item.image_url,
  imageAlt: item.title,
  imageWidth: "400px",
  imageHeight: "300px",
  confirmButtonText: 'CLOSE',
  confirmButtonColor: '#2563eb',
  customClass: { 
    popup: 'rounded-[2.5rem]', 
    // Added 'object-cover' here. 
    // If using Tailwind, this works. If not, see the 'didOpen' fix below.
    image: 'rounded-2xl object-cover' 
  },
  // This ensures the style is applied even if SweetAlert tries to override it
  didOpen: () => {
    const img = Swal.getImage();
    if (img) {
      img.style.objectFit = 'cover';
    }
  }
});
  };

  return (
    <div className='max-w-screen mx-auto py-16 px-6'>
      {/* HEADER */}
      <div className='flex items-center justify-between mb-10'>
        <div>
          <h3 className='text-3xl font-black text-blue-950 uppercase tracking-tighter'>
            Royal <span className='text-blue-600'>News</span>
          </h3>
          <div className='w-12 h-1.5 bg-blue-600 rounded-full mt-2'></div>
        </div>
        
        {/* CUSTOM NAVIGATION BUTTONS */}
        <div className='flex gap-2'>
          <button className='swiper-prev-btn w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm'>
            <FaChevronLeft />
          </button>
          <button className='swiper-next-btn w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm'>
            <FaChevronRight />
          </button>
        </div>
      </div>

      {loading ? (
        <div className='h-64 flex items-center justify-center animate-pulse text-slate-300 font-black uppercase tracking-widest'>Loading Newsfeed...</div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-next-btn',
            prevEl: '.swiper-prev-btn',
          }}
          autoplay={{ delay: 4000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1536: { slidesPerView: 5 }, // This is your 5-column requirement
          }}
          className="pb-12"
        >
          {fetchNews.map((item) => {
            const date = new Date(item.created_at);
            return (
              <SwiperSlide key={item.id}>
                <div 
                  onClick={() => handleNewsClick(item)}
                  className='group relative bg-white rounded-xl overflow-hidden border border-slate-50 shadow-lg shadow-slate-200/50 cursor-pointer h-full transition-all duration-500 hover:-translate-y-2'
                >
                  {/* IMAGE */}
                  <div className='h-48 overflow-hidden relative'>
                    <img 
                      src={item.image_url} 
                      className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                      alt={item.title} 
                    />
                    <div className='absolute top-4 left-4 bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest'>
                      {date.toLocaleString('default', { month: 'short' })} {date.getDate()}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className='p-6'>
                    <span className='text-[8px] font-black text-blue-500 uppercase tracking-widest mb-2 block'>
                      {item.club || 'School News'}
                    </span>
                    <h2 className='text-lg font-black text-blue-950 leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors uppercase'>
                      {item.title}
                    </h2>
                    <p className='text-slate-500 text-xs font-medium line-clamp-2 mb-4'>
                      {item.content}
                    </p>
                    <div className='flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest group-hover:gap-4 transition-all'>
                      Read More <FaArrowRight />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  )
}