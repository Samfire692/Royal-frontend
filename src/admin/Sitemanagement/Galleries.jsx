import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2'
import { FaCloudUploadAlt, FaSpinner, FaTag, FaTrash, FaEye, FaThLarge } from 'react-icons/fa'

export const Galleries = () => {
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedRole, setSelectedRole] = useState('Classroom')
  const [title, setTitle] = useState('')
  
  const [viewMode, setViewMode] = useState('upload') // 'upload' or 'manage'
  const [galleryItems, setGalleryItems] = useState([])
  const [filter, setFilter] = useState('All')

  const roles = ['Classroom', 'Laboratory', 'Sports', 'Hostel', 'Admin', 'General']

  // --- FETCH GALLERY ITEMS ---
  const fetchGallery = async () => {
    setFetchLoading(true)
    try {
      const { data, error } = await supabase
        .from('royal_gallery')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error

      // Get proper Public URLs for all images
      const formattedData = data.map(item => {
        const { data: pUrl } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(item.image_url)
        return { ...item, display_url: pUrl.publicUrl }
      })

      setGalleryItems(formattedData)
    } catch (err) {
      console.error(err.message)
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'manage') fetchGallery()
  }, [viewMode])

  // --- DELETE FUNCTION ---
  const handleDelete = async (id, fileName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This photo will be deleted forever!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        // 1. Delete from Storage
        await supabase.storage.from('gallery-images').remove([fileName])
        // 2. Delete from DB
        await supabase.from('royal_gallery').delete().eq('id', id)
        
        setGalleryItems(galleryItems.filter(item => item.id !== id))
        Swal.fire('Deleted!', 'Photo has been removed.', 'success')
      } catch (err) {
        Swal.fire('Error', err.message, 'error')
      }
    }
  }

  // --- UPLOAD LOGIC ---
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!imageFile) return Swal.fire('Wait!', 'Select a photo first', 'warning')
    if (!title.trim()) return Swal.fire('Wait!', 'Give this photo a title', 'warning')

    setLoading(true)
    try {
      const fileName = `${Date.now()}_${imageFile.name}`
      const { error: uploadError } = await supabase.storage.from('gallery-images').upload(fileName, imageFile)
      if (uploadError) throw uploadError

      const { error: dbError } = await supabase.from('royal_gallery').insert([{ 
          image_url: fileName, 
          role: selectedRole,
          title: title 
      }])
      if (dbError) throw dbError

      Swal.fire('Success!', 'Photo added to gallery', 'success')
      setPreviewUrl(null); setImageFile(null); setTitle('')
    } catch (err) {
      Swal.fire('Error', err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = filter === 'All' ? galleryItems : galleryItems.filter(item => item.role === filter)

  return (
    <div className="max-w-5xl mx-auto">
      {/* TOGGLE HEADER */}
      <div className='flex justify-between items-center mb-8 bg-white p-2 rounded-3xl shadow-sm border border-slate-100'>
        <button 
            onClick={() => setViewMode('upload')}
            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'upload' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
            Add New Photo
        </button>
        <button 
            onClick={() => setViewMode('manage')}
            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'manage' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
            Manage Gallery
        </button>
      </div>

      {viewMode === 'upload' ? (
        <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto">
           {/* ... (Your existing form code stays here) ... */}
           <div className='flex items-center gap-3 mb-8'>
            <div className='bg-blue-600 p-3 rounded-2xl text-white'><FaCloudUploadAlt className='text-2xl' /></div>
            <div>
              <h2 className="text-xl font-black text-blue-950 uppercase tracking-tight">Gallery Upload</h2>
              <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Add new school memories</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest'>Photo Title / Heading</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. JSS 2 Classrooms" className='w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-blue-950' />
            </div>

            <div className="relative w-full h-56 bg-slate-50 border-4 border-dashed border-slate-200 rounded-4xl flex flex-col items-center justify-center overflow-hidden group hover:border-blue-400 transition-all">
              {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" /> : <p className="text-slate-400 font-black text-xs uppercase">Tap to Select Image</p>}
              <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest flex items-center gap-2"><FaTag className='text-blue-600' /> Select Category</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => (
                  <button key={role} type="button" onClick={() => setSelectedRole(role)} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${selectedRole === role ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>{role}</button>
                ))}
              </div>
            </div>

            <button disabled={loading} className="w-full h-16 bg-blue-600 rounded-3xl text-white font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center">
              {loading ? <FaSpinner className="animate-spin text-xl" /> : "Upload to Gallery"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
            {/* FILTER BAR */}
            <div className='flex gap-2 overflow-x-auto pb-4 no-scrollbar'>
                {['All', ...roles].map(r => (
                    <button key={r} onClick={() => setFilter(r)} className={`px-6 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${filter === r ? 'bg-blue-950 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                        {r}
                    </button>
                ))}
            </div>

            {fetchLoading ? (
                <div className='h-64 flex items-center justify-center'><FaSpinner className='animate-spin text-4xl text-blue-600' /></div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filteredItems.map(item => (
                        <div key={item.id} className='bg-white rounded-4xl p-3 shadow-sm border border-slate-50 group hover:shadow-xl transition-all'>
                            <div className='h-48 rounded-3xl overflow-hidden relative'>
                                <img src={item.display_url} className='w-full h-full object-cover' alt={item.title} />
                                <div className='absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase text-blue-950'>
                                    {item.role}
                                </div>
                            </div>
                            <div className='p-4 flex justify-between items-center'>
                                <div>
                                    <h3 className='font-black text-blue-950 text-sm uppercase truncate w-32'>{item.title}</h3>
                                    <p className='text-[9px] text-slate-400 font-bold uppercase'>{new Date(item.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <button onClick={() => handleDelete(item.id, item.image_url)} className='w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all'>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {filteredItems.length === 0 && !fetchLoading && <p className='text-center text-slate-400 font-bold uppercase text-xs py-20'>No photos found in this category</p>}
        </div>
      )}
    </div>
  )
}