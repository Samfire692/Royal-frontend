import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Facilities as HomeFacilities } from './Home/Facilities'
import { 
  FaBaby, 
  FaGraduationCap, 
  FaBookReader, 
  FaSchool, 
  FaArrowRight 
} from 'react-icons/fa'
import { supabase } from '../supabaseClient'

export const Facilities = () => {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("royalclassrooms")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) console.log("Error: " + error.message);
      else setInfo(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // --- Grouping Logic ---
  const groups = [
    {
      title: "Early Years Foundation",
      description: "A warm, playful start where curiosity meets discovery for our youngest learners.",
      icon: <FaBaby />,
      color: "blue",
      levels: info.filter(i => /prep|nursery/i.test(i.class_name))
    },
    {
      title: "Primary Excellence",
      description: "Building strong pillars in literacy, numeracy, and character for the leaders of tomorrow.",
      icon: <FaBookReader />,
      color: "indigo",
      levels: info.filter(i => /primary/i.test(i.class_name))
    },
    {
      title: "Junior Secondary (JSS)",
      description: "Transitioning into critical thinking and specialized subjects with confidence.",
      icon: <FaSchool />,
      color: "cyan",
      levels: info.filter(i => /jss/i.test(i.class_name))
    },
    {
      title: "Senior Secondary (SSS)",
      description: "Advanced preparation for university and global career pathways.",
      icon: <FaGraduationCap />,
      color: "blue",
      levels: info.filter(i => /sss/i.test(i.class_name))
    }
  ];

  return (
    <div className='py-4 bg-white'>
      <HomeFacilities /><br />

      <div className='px-4 md:px-8 py-16 bg-slate-50/50'>
        <div className='max-w-7xl mx-auto'>
          
          <div className='mb-16 text-center md:text-left'>
            <h2 className='text-4xl md:text-5xl font-black text-blue-950 mb-4'>
              Academic Excellence
            </h2>
            <p className='text-slate-500 max-w-2xl text-lg leading-relaxed'>
              We provide a seamless educational journey from the first steps of a toddler 
              to the final graduation of a refined scholar.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
              {groups.map((group, idx) => (
                <div 
                  key={idx}
                  className='bg-white p-8 md:p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-xl shadow-blue-900/5 hover:border-blue-500 transition-all duration-500 group overflow-hidden relative'
                >
                  {/* Design element: Faded background icon */}
                  <div className='absolute -right-10 -bottom-10 text-[12rem] text-slate-50 opacity-10 group-hover:text-blue-100 group-hover:scale-110 transition-all duration-700'>
                    {group.icon}
                  </div>

                  <div className='relative z-10'>
                    <div className='w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform'>
                      {group.icon}
                    </div>

                    <h3 className='text-3xl font-black text-blue-950 mb-4'>{group.title}</h3>
                    <p className='text-slate-500 mb-8 leading-relaxed font-medium'>{group.description}</p>

                    {/* The specific classes under this group */}
                    <div className='flex flex-wrap gap-3 mb-10'>
                      {group.levels.length > 0 ? (
                        group.levels.map((cls) => (
                          <span key={cls.id} className='px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-blue-900 text-sm font-bold group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors'>
                            {cls.class_name}
                          </span>
                        ))
                      ) : (
                        <span className='text-slate-400 italic text-sm'>Levels coming soon...</span>
                      )}
                    </div>

                    <Link 
                      to="/gallery" 
                      className='inline-flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all'
                    >
                      Explore This Section <FaArrowRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Visit Full Gallery CTA */}
          <div className='mt-24 p-12 bg-blue-950 rounded-[4rem] text-center relative overflow-hidden'>
            <div className='absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none'>
               {/* Pattern overlay */}
            </div>
            <h3 className='text-3xl font-bold text-white mb-4 relative z-10'>Experience the Royal Standard</h3>
            <p className='text-blue-100/80 mb-8 max-w-xl mx-auto relative z-10'>Take a visual tour through our world-class facilities and student activities.</p>
            <Link 
              to="/gallery" 
              className='relative z-10 inline-block bg-white text-blue-950 px-12 py-5 rounded-2xl font-black hover:scale-105 transition-transform shadow-2xl'
            >
              Open Photo Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}