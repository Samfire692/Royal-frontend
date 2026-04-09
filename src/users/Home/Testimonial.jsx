import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.log('Error:', error);
      else setTestimonials(data);
    };

    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-5 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">
            Voices of Our Parents
          </h2>
          <div className="w-16 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col relative group hover:scale-[1.02] transition-transform duration-300">
                
                <FaQuoteLeft className="text-blue-100 text-5xl absolute top-6 right-8 opacity-50" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-600 leading-relaxed italic mb-8 flex-1 text-sm md:text-base">
                  "{item.content}"
                </p>

                {/* Parent Info */}
                <div className="flex items-center gap-4 border-t pt-6 border-slate-50">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-100 shadow-sm">
                    <img 
                      src={item.image_url} 
                      className="w-full h-full object-cover" 
                      alt={item.name} 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.name}</h4>
                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-tighter">Verified Parent</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};