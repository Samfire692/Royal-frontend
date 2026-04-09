import React, { useState } from 'react'
import { FaPlus, FaStar } from 'react-icons/fa'
import { supabase } from '../../supabaseClient' 
import Swal from 'sweetalert2'
import { EditDelNews } from './EditDelNews'
import { EditDelTestimonial } from './EditDelTestimonial'

export const Testimonial = () => {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [rating, setRating] = useState(5) // Default to 5 stars
  const [hover, setHover] = useState(0)
  const [activeView, setActiveview]= useState(false)

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const name = formData.get('name')
    const content = formData.get('content')

    try {
      if (!imageFile) throw new Error("Please upload a parent/student image!")

      // 1. Upload Image to Storage
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('testimonial-images') // Make sure this bucket exists in Supabase!
        .upload(fileName, imageFile)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('testimonial-images')
        .getPublicUrl(fileName)

      // 2. Insert into Database
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert([{ 
          name, 
          content, 
          rating, 
          image_url: publicUrlData.publicUrl 
        }])

      if (insertError) throw insertError

      Swal.fire('Success', 'Testimonial Uploaded', 'success')
      
      // Reset Form
      setPreviewUrl(null)
      setImageFile(null)
      setRating(5)
      e.target.reset()

    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={` ${activeView ? "lg:flex justify-between" : ""}`}>
        <div className='p-2'>
        <div className='flex justify-between'>
         <h2 className='text-blue-800 text-xl font-bold'>Add New Testimonial</h2>
         <button onClick={()=> setActiveview(!activeView)}>View</button>
     </div>
      
      <form onSubmit={handleSubmit} className={`mt-4`}>
        <div className={`flex flex-col lg:flex-row gap-5 ${activeView ? "hidden lg:flex" : ""}`}>
          
          {/* IMAGE UPLOAD BOX */}
          <div className='relative w-70 h-52 border-2 border-slate-300 rounded-3xl flex flex-col items-center justify-center overflow-hidden bg-slate-50 m-auto'>
            {previewUrl ? (
              <img src={previewUrl} className='w-full h-full object-cover' alt="Preview" />
            ) : (
              <>
                <FaPlus className='text-4xl text-slate-400 mb-2' />
                <span className='text-slate-400 text-xs font-bold'>Upload Photo</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className='absolute inset-0 opacity-0 cursor-pointer' 
              required 
            />
          </div>

          {/* FORM FIELDS */}
          <div className='flex-1 flex flex-col gap-4'>
            <div className='flex lg:flex-row flex-col gap-3'>
                <div className='grid gap-1.5 w-full'>
              <label className='font-bold text-slate-700'>Parent/Student Name :</label>
              <input 
                name="name" 
                type="text" 
                placeholder="e.g. Mr. Blessing Christopher"
                className='border-2 border-slate-100 h-12 p-3 rounded-2xl focus:border-blue-500 outline-none transition-all' 
                required 
              />
            </div>

            {/* STAR RATING PICKER */}
            <div className='grid gap-1.5'>
              <label className='font-bold text-slate-700'>Rating :</label>
              <div className='flex gap-2 bg-blue-50 w-fit p-3 rounded-2xl'>
                {[...Array(5)].map((_, i) => {
                  const val = i + 1
                  return (
                    <FaStar
                      key={val}
                      className={`text-2xl cursor-pointer transition-all ${val <= (hover || rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                      onClick={() => setRating(val)}
                      onMouseEnter={() => setHover(val)}
                      onMouseLeave={() => setHover(0)}
                    />
                  )
                })}
              </div>
            </div>
            </div>

            <div className='grid gap-1.5'>
              <label className='font-bold text-slate-700'>Testimonial Content :</label>
              <textarea 
                name="content" 
                placeholder="What are they saying about the school?"
                className='border-2 border-slate-100 p-4 rounded-2xl h-32 focus:border-blue-500 outline-none transition-all resize-none' 
                required
              ></textarea>
            </div>

            <button 
              disabled={loading}
              className='bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:bg-slate-400'
            >
              {loading ? 'Submitting...' : 'Upload Testimonial'}
            </button>
          </div>
        </div>
      </form>
    </div>

    <div>
        {activeView && (
            <EditDelTestimonial/>
        )}
    </div>
    </div>
  )
}