import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import { FaHashtag, FaCalendarAlt, FaQuoteLeft } from 'react-icons/fa';
import { Footer } from './Footer';

export const News = () => {
  const [fetchNews, setFetchnews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("error: " + error.message)
    } else {
      setFetchnews(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className='max-w-350 mx-auto pt-8 min-h-screen bg-slate-50/50'>
      {/* HEADER SECTION */}
      <div className='mb-16 text-center'>
        <div className='inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full mb-6'>
          <FaHashtag className='text-[10px]' />
          <span className='text-[10px] font-black uppercase tracking-[0.2em]'>Royal Archives</span>
        </div>
        <h3 className='text-5xl md:text-7xl font-black text-blue-950 tracking-tighter uppercase mb-6'>
          The News <span className='text-blue-600'>Hub</span>
        </h3>
        <p className='text-slate-500 font-bold uppercase tracking-widest text-[10px] max-w-lg mx-auto leading-relaxed'>
          Complete coverage of school life, academic breakthroughs, and official press releases.
        </p>
      </div>

      {loading ? (
        <div className='py-40 text-center'>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className='font-black text-blue-950 uppercase tracking-widest text-xs'>Loading Encyclopedia...</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4'>
          {fetchNews.map((item) => {
            const date = new Date(item.created_at);
            return (
              <div 
                key={item.id} 
                className='flex flex-col bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/5 border border-white group transition-all duration-500 hover:-translate-y-3'
              >
                {/* TOP IMAGE SECTION */}
                <div className='h-72 w-full overflow-hidden relative'>
                  <img 
                    src={item.image_url} 
                    className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110' 
                    alt={item.title} 
                  />
                  {/* FLOATING DATE */}
                  <div className='absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl flex flex-col items-center min-w-17.5'>
                    <span className='text-2xl font-black text-blue-950 leading-none'>{date.getDate()}</span>
                    <span className='text-[9px] font-black text-blue-600 uppercase tracking-tighter'>{date.toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  {/* CATEGORY CHIP */}
                  <div className='absolute top-6 right-6 bg-blue-600 text-white px-4 py-1.5 rounded-2xl text-[8px] font-black uppercase tracking-widest shadow-lg'>
                    {item.club || 'News'}
                  </div>
                </div>

                {/* CONTENT SECTION */}
                <div className='p-10 grow flex flex-col'>
                  <div className='mb-6'>
                     <FaQuoteLeft className='text-blue-100 text-3xl mb-4' />
                     <h2 className='text-2xl font-black text-blue-950 leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors'>
                        {item.title}
                     </h2>
                  </div>
                  
                  {/* THE FULL CONTENT - SCROLLABLE IF TOO LONG */}
                  <div className='text-slate-500 font-medium leading-relaxed text-sm space-y-4 mb-8 max-h-62.5 overflow-y-auto pr-2 custom-scrollbar'>
                    {item.content}
                  </div>

                  {/* FOOTER AREA */}
                  <div className='mt-auto pt-6 border-t border-slate-50 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center'>
                            <FaCalendarAlt className='text-blue-600 text-[10px]' />
                        </div>
                        <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                            Batch {date.getFullYear()}
                        </span>
                    </div>
                    <div className='w-2 h-2 rounded-full bg-blue-600 animate-pulse'></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {fetchNews.length === 0 && !loading && (
        <div className='py-40 text-center'>
          <p className='text-slate-300 font-black uppercase text-sm tracking-[0.5em]'>Archive Empty</p>
        </div>
      )}

      <div>
        <Footer/>
      </div>
    </div>
    
  )
}