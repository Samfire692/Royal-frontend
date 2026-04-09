import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { supabase } from '../../supabaseClient' 
import Swal from 'sweetalert2'
import { EditDelNews } from './EditDelNews'

export const News = () => {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [activeView, setactiveView]= useState(false)

  // 1. Handle Image Selection & Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        const maxSize = 2 * 1024 * 1024 
      
      if (file.size > maxSize) {
        alert("Omo, this file is too big! Please select an image under 2MB.")
        e.target.value = "" // Clear the input
        setPreviewUrl(null)
        setImageFile(null)
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
    const club = formData.get('club')
    const content = formData.get('content')

    try {
      let imageUrl = ''

      if (!imageFile) {
         return Swal.fire({
            icon:"warning",
            title:"Warning",
            text:"Image upload cannot be empty!"
         })
      }

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('news-images') 
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('news-images')
          .getPublicUrl(filePath)
        
        imageUrl = publicUrlData.publicUrl
      }

      const { error: insertError } = await supabase
        .from('news')
        .insert([{ 
          title, 
          club, 
          content, 
          image_url: imageUrl 
        }])

      if (insertError) throw insertError

      alert('News Uploaded Successfully!')
    
      setPreviewUrl(null)
      setImageFile(null)
      e.target.reset()

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={` ${activeView ? "lg:flex gap-5" : " "}`}>
     <div>
        <div className='flex justify-between'>
         <h2 className='text-blue-800 text-xl font-bold'>News</h2>
         <button className={`text-blue-600 ${activeView ? "text-red-700" : ""}`} onClick={()=> setactiveView(!activeView)}>View</button>
     </div><br />

      <div className={`flex lg:flex-row flex-col gap-3 ${activeView ? "hidden lg:flex" : ""}`}>
         {/* IMAGE UPLOAD BOX */}
         <div className='border-2 p-3 w-70 h-50 rounded-2xl flex flex-col place-items-center justify-center m-auto relative overflow-hidden'>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className='absolute inset-0 w-full h-full object-cover' />
            ) : (
              <>
                <FaPlus className='text-5xl text-slate-500'/>
                <span className='text-slate-500 mt-2 text-center'>Upload News Images</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*"
              className='absolute inset-0 opacity-0 cursor-pointer' 
              onChange={handleImageChange}
              required 
            />
         </div><br />

         {/* FORM AREA */}
         <div className='w-full'>
           <form onSubmit={handleSubmit} className='grid gap-3'>
             <div className='grid lg:grid-cols-2 gap-3'>
                <div className='grid gap-1.5'>
                  <label className='font-bold'>News Heading :</label>
                  <input name="title" type="text" className='border h-13 p-2 rounded-xl' required/>   
               </div> 

               <div className='grid gap-1.5'>
                 <label className='font-bold'>Club :</label>
                 <select name="club" className='bg-blue-500 text-white h-13 p-2 rounded-xl' required>
                  <option value="">Select Clubs</option>
                  <option value="Press Club">Press Club</option>
                  <option value="Jet Club">Jet Club</option> 
                  <option value="HomeMakers Club">HomeMakers Club</option> 
                  <option value="Debate Club">Debate Club</option>    
                 </select>   
               </div> 
             </div>

              <div className='grid gap-1.5'>
               <label className='font-bold'>News Content :</label>
               <textarea name="content" className='border h-40 p-2 rounded-xl' required></textarea>   
             </div> 
            
            <div className='flex justify-center'>
                <button 
                  disabled={loading}
                  className='p-2.5 bg-blue-500 w-full rounded-xl text-white disabled:bg-slate-400'
                >
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
           </form>   
         </div>
      </div>
      
     </div><br />
     
     {activeView && (
        <EditDelNews/>
     )}
    </div>
  )
}