import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2'
import { FaPlus, FaImage, FaTrash, FaSpinner } from 'react-icons/fa'
import { EditDelNews } from './EditDelNews'
import { EditDelEvents } from './EditDelEvents'

export const Events = () => {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [activeView, setactiveView] = useState(false)
  const [activeTab, setActiveTab] = useState('events')

  const PROJECT_ID = '[YOUR_PROJECT_ID]'; // Put your ID here sharp-sharp
  const BUCKET = 'event_images';

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        Swal.fire("Error", "File too big! Keep it under 2MB.", "error")
        e.target.value = ""
        return
      }
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const title = formData.get('title')
    const content = formData.get('content')

    try {
      if (!imageFile) throw new Error("Image upload cannot be empty!")

      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      const imageUrl = fileName; // Storing just the name is cleaner if you build URL in view

      if (activeTab === 'events') {
        const { error: insertError } = await supabase
          .from('royal_events')
          .insert([{ title, content, image_url: imageUrl }])
        if (insertError) throw insertError
        Swal.fire('Success', 'Event Uploaded!', 'success')
      } else {
        const { error: insertError } = await supabase
          .from('royal_gallery')
          .insert([{ image_url: imageUrl }])
        if (insertError) throw insertError
        Swal.fire('Success', 'Added to Gallery!', 'success')
      }

      setPreviewUrl(null)
      setImageFile(null)
      e.target.reset()
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={` ${activeView ? "lg:flex gap-5" : " "}`}>
      <div className='w-full'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex gap-6'>
            <button 
              onClick={() => { setActiveTab('events'); setactiveView(false); }} 
              className={`text-xl font-black uppercase ${activeTab === 'events' ? 'text-blue-800 border-b-4 border-blue-800' : 'text-slate-400'}`}
            >
              Events
            </button>
            <button 
              onClick={() => { setActiveTab('gallery'); setactiveView(false); }} 
              className={`text-xl font-black uppercase ${activeTab === 'gallery' ? 'text-blue-800 border-b-4 border-blue-800' : 'text-slate-400'}`}
            >
              Gallery
            </button>
          </div>
          <button 
            className={`font-bold transition-colors ${activeView ? "text-red-600" : "text-blue-600"}`} 
            onClick={() => setactiveView(!activeView)}
          >
            {activeView ? "[ Close ]" : "[ View All ]"}
          </button>
        </div>

        <div className={`flex lg:flex-row flex-col gap-6 ${activeView ? "hidden lg:flex" : ""}`}>
          {/* IMAGE UPLOAD BOX */}
          <div className='border-4 border-dashed border-slate-200 p-3 w-80 h-60 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden bg-white shrink-0'>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className='absolute inset-0 w-full h-full object-cover' />
            ) : (
              <div className='text-center'>
                <FaPlus className='text-4xl text-slate-300 mx-auto mb-2'/>
                <span className='text-slate-400 text-xs font-bold uppercase tracking-wider'>Select Image</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              className='absolute inset-0 opacity-0 cursor-pointer' 
              onChange={handleImageChange}
            />
          </div>

          {/* FORM AREA */}
          <div className='grow'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              {activeTab === 'events' ? (
                <>
                  <div className='flex flex-col gap-2'>
                    <label className='font-black text-blue-900 text-sm uppercase'>Event Title</label>
                    <input name="title" type="text" placeholder="Enter event heading..." className='border-2 border-slate-100 h-14 p-4 rounded-2xl focus:border-blue-500 outline-none bg-white shadow-sm' required/>   
                  </div> 

                  <div className='flex flex-col gap-2'>
                    <label className='font-black text-blue-900 text-sm uppercase'>Description</label>
                    <textarea name="content" placeholder="Write event details here..." className='border-2 border-slate-100 h-32 p-4 rounded-2xl focus:border-blue-500 outline-none bg-white shadow-sm resize-none' required></textarea>   
                  </div> 
                </>
              ) : (
                <div className='h-full flex items-center justify-center p-10 bg-blue-50 rounded-3xl border-2 border-blue-100 border-dashed'>
                   <p className='text-blue-800 font-bold text-center'>Gallery Mode: Just pick an image and hit upload! 📸</p>
                </div>
              )}

              <button 
                disabled={loading}
                className='h-14 bg-blue-600 w-full rounded-2xl text-white font-black uppercase tracking-widest disabled:bg-slate-300 hover:bg-blue-700 transition-all shadow-lg'
              >
                {loading ? <FaSpinner className='animate-spin mx-auto text-xl'/> : `Post to ${activeTab}`}
              </button>
            </form>   
          </div>
        </div>
      </div>

      {activeView && (
        <div className='grow min-w-100'>
          <EditDelEvents activeTab={activeTab}/>
        </div>
      )}
    </div>
  )
}