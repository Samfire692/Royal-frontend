import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { FaLayerGroup, FaCameraRetro, FaExpandAlt } from 'react-icons/fa'
import { Footer } from './Footer'

export const Events = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  const categories = ['All', 'Classroom', 'Laboratory', 'Sports', 'Hostel', 'Admin']

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('royal_gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedData = data.map(item => {
        const { data: pUrl } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(item.image_url)
        return { ...item, display_url: pUrl.publicUrl }
      })

      setItems(formattedData)
    } catch (err) {
      console.error("Error fetching gallery:", err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.role === filter)

  return (
    <div className="min-h-screen bg-slate-50 pt-8">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
          <FaCameraRetro className="text-blue-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Our Memories</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-blue-950 mb-4 tracking-tighter">
          School <span className="text-blue-600">Gallery</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          A visual journey through our academic excellence, sporting spirit, and vibrant campus life.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm
              ${filter === cat 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105' 
                : 'bg-white text-slate-400 hover:bg-slate-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GALLERY GRID */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-black uppercase text-[10px] tracking-widest">Loading Memories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500"
              >
                {/* IMAGE CONTAINER */}
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={item.display_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* OVERLAY ON HOVER */}
                  <div className="absolute inset-0 bg-linear-to-t from-blue-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <button className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-white hover:bg-white/40 transition-all">
                        <FaExpandAlt />
                    </button>
                  </div>
                  {/* CATEGORY TAG */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl shadow-lg">
                    <p className="text-[9px] font-black uppercase text-blue-600 tracking-wider flex items-center gap-2">
                      <FaLayerGroup /> {item.role}
                    </p>
                  </div>
                </div>

                {/* TEXT CONTENT */}
                <div className="p-8">
                  <h3 className="text-xl font-black text-blue-950 mb-2 leading-tight uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <div className="w-12 h-1 bg-blue-600 rounded-full mb-3 group-hover:w-full transition-all duration-500"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No photos found in {filter}</p>
          </div>
        )}
      </div><br />

      <div>
        <Footer/>
      </div>
    </div>
  )
}