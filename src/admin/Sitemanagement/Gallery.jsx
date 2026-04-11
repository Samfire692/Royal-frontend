import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2'
import { FaPlus, FaTrash, FaEdit, FaImage, FaCalendarAlt, FaSpinner } from 'react-icons/fa'

export const Gallery = () => {
  const [activeTab, setActiveTab] = useState('events')
  const [loading, setLoading] = useState(false)
  
  // Replace this with your actual Supabase Project ID
  const PROJECT_ID = '[YOUR_PROJECT_ID]';
  const BUCKET = 'royal-assets';

  const [events, setEvents] = useState([])
  const [eventForm, setEventForm] = useState({ id: null, title: '', content: '', image_url: '' })
  const [eventFile, setEventFile] = useState(null)

  const [gallery, setGallery] = useState([])

  useEffect(() => {
    fetchEvents()
    fetchGallery()
  }, [])

  const fetchEvents = async () => {
    const { data } = await supabase.from('royal_events').select('*').order('created_at', { ascending: false })
    if (data) setEvents(data)
  }

  const fetchGallery = async () => {
    const { data } = await supabase.from('royal_gallery').select('*').order('created_at', { ascending: false })
    if (data) setGallery(data)
  }

  const handleEventSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    let finalImageUrl = eventForm.image_url

    try {
      if (eventFile) {
        const fileName = `${Date.now()}_event.jpg`
        const { error: upError } = await supabase.storage.from(BUCKET).upload(fileName, eventFile)
        if (upError) throw upError
        finalImageUrl = fileName
      }

      if (eventForm.id) {
        await supabase.from('royal_events').update({ 
          title: eventForm.title, 
          content: eventForm.content, 
          image_url: finalImageUrl 
        }).eq('id', eventForm.id)
      } else {
        await supabase.from('royal_events').insert([{ 
          title: eventForm.title, 
          content: eventForm.content, 
          image_url: finalImageUrl 
        }])
      }

      Swal.fire('Success', 'Event saved successfully', 'success')
      setEventForm({ id: null, title: '', content: '', image_url: '' })
      setEventFile(null)
      fetchEvents()
    } catch (err) {
      Swal.fire('Error', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (id) => {
    const confirm = await Swal.fire({ title: 'Are you sure?', showCancelButton: true })
    if (confirm.isConfirmed) {
      await supabase.from('royal_events').delete().eq('id', id)
      fetchEvents()
    }
  }

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)

    try {
      const fileName = `${Date.now()}_gallery.jpg`
      const { error: upError } = await supabase.storage.from(BUCKET).upload(fileName, file)
      if (upError) throw upError

      await supabase.from('royal_gallery').insert([{ image_url: fileName }])
      fetchGallery()
      Swal.fire('Uploaded!', 'Image added to gallery', 'success')
    } catch (err) {
      Swal.fire('Error', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const deleteGalleryImg = async (id) => {
    const confirm = await Swal.fire({ title: 'Delete image?', showCancelButton: true })
    if (confirm.isConfirmed) {
      await supabase.from('royal_gallery').delete().eq('id', id)
      fetchGallery()
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 p-4 md:p-10'>
      <div className='max-w-6xl mx-auto'>
        
        <div className='flex flex-col md:flex-row justify-between items-center mb-10 gap-6'>
          <h2 className='text-3xl font-black text-blue-950 uppercase'>School Manager</h2>
          <div className='flex bg-white p-1 rounded-2xl shadow-md border border-slate-100'>
            <button onClick={() => setActiveTab('events')} className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Events</button>
            <button onClick={() => setActiveTab('gallery')} className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'gallery' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Gallery</button>
          </div>
        </div>

        {activeTab === 'events' && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='bg-white p-6 rounded-3xl shadow-xl border border-slate-100 h-fit'>
              <h3 className='text-xl font-black text-blue-900 mb-6 flex items-center gap-2'><FaPlus/> {eventForm.id ? 'Edit Event' : 'Add New Event'}</h3>
              <form onSubmit={handleEventSubmit} className='space-y-4'>
                <input type="text" placeholder="Event Title" required value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} className='w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500' />
                <textarea placeholder="Event Content" required rows="4" value={eventForm.content} onChange={(e) => setEventForm({...eventForm, content: e.target.value})} className='w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500' />
                <div className='border-2 border-dashed border-slate-200 p-4 rounded-xl text-center relative'>
                  <input type="file" onChange={(e) => setEventFile(e.target.files[0])} className='text-xs' />
                  <p className='text-[10px] text-slate-400 mt-1 uppercase font-bold'>Event Poster</p>
                </div>
                <button disabled={loading} className='w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center items-center gap-2'>
                  {loading ? <FaSpinner className='animate-spin'/> : 'Save Event'}
                </button>
              </form>
            </div>

            <div className='lg:col-span-2 space-y-4'>
              {events.map(ev => (
                <div key={ev.id} className='bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-center'>
                  <div className='w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0'>
                    <img 
                      src={`https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET}/${ev.image_url}`} 
                      alt={ev.title} 
                      className='w-full h-full object-cover'
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }} 
                    />
                  </div>
                  <div className='grow'>
                    <h4 className='font-black text-blue-900'>{ev.title}</h4>
                    <p className='text-xs text-slate-500 line-clamp-1'>{ev.content}</p>
                  </div>
                  <div className='flex gap-2'>
                    <button onClick={() => setEventForm(ev)} className='p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all'><FaEdit/></button>
                    <button onClick={() => deleteEvent(ev.id)} className='p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all'><FaTrash/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <div className='mb-8 bg-blue-600 p-8 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-6'>
              <div>
                <h3 className='text-2xl font-black'>Photo Gallery</h3>
                <p className='opacity-80'>Upload and manage school activity photos</p>
              </div>
              <label className='cursor-pointer bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center gap-2'>
                <FaPlus/> {loading ? 'Uploading...' : 'Upload New Photo'}
                <input type="file" hidden onChange={handleGalleryUpload} disabled={loading}/>
              </label>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {gallery.map(img => (
                <div key={img.id} className='relative group aspect-square rounded-4xl overflow-hidden border-4 border-white shadow-lg'>
                  <img 
                    src={`https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET}/${img.image_url}`} 
                    className='w-full h-full object-cover'
                    alt="Gallery"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error' }}
                  />
                  <div className='absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center'>
                    <button onClick={() => deleteGalleryImg(img.id)} className='bg-red-500 text-white p-3 rounded-xl shadow-xl transition-all'>
                      <FaTrash/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}