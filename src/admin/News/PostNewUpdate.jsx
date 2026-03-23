import React, { useState } from 'react'
import { FaCloudUploadAlt, FaPaperPlane, FaRegIdCard } from 'react-icons/fa'
import { supabase } from '' // Make sure your path is correct!

export const PostNewUpdate = () => {
  // --- FORM STATES ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [role, setRole] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Save actual file for upload
      setImagePreview(URL.createObjectURL(file)); // Save preview for UI
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      // 1. UPLOAD IMAGE
      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        const { data: storageData, error: storageError } = await supabase
          .storage
          .from('news-images') // Make sure this bucket exists in Supabase!
          .upload(fileName, imageFile);

        if (storageError) throw storageError;

        // Get Public URL
        const { data } = supabase.storage.from('news-images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      // 2. SAVE TO DATABASE
      const { error: dbError } = await supabase
        .from('news_updates')
        .insert([{ 
            title, 
            content, 
            author_role: role, 
            image_url: imageUrl 
        }]);

      if (dbError) throw dbError;

      alert("Post Published Successfully! 🚀");
      
      // Reset Form
      setTitle(''); setContent(''); setRole(''); setImagePreview(null); setImageFile(null);
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4 text-black h-full flex flex-col gap-5 lg:w-[50vw] w-[85vw]'>
      <h2 className='text-2xl font-bold flex gap-2 text-blue-600 border-b pb-2'>
        <FaRegIdCard className='my-auto'/> Create News Post
      </h2>

      <form onSubmit={handlePublish} className='flex flex-col gap-4 overflow-y-auto'>
        
        {/* 1. NEWS TITLE */}
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm'>Headline / Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a catchy headline..." 
            className='border-2 border-gray-300 p-2 rounded-lg outline-none focus:border-blue-500 transition'
            required
          />
        </div>

        {/* 2. IMAGE UPLOAD & PREVIEW */}
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm'>Add Cover Image</label>
          <label className='relative border-2 border-dashed border-gray-400 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition overflow-hidden'>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className='w-full h-full object-cover' />
            ) : (
              <>
                <FaCloudUploadAlt className='text-4xl text-gray-400' />
                <span className='text-gray-500 text-sm'>Click to browse files</span>
              </>
            )}
            <input type="file" className='hidden' onChange={handleImageChange} accept="image/*" />
          </label>
        </div>

        {/* 3. NEWS CONTENT */}
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm'>News Details</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the full story here..." 
            className='border-2 border-gray-300 p-2 rounded-lg h-32 outline-none focus:border-blue-500 transition resize-none'
            required
          ></textarea>
        </div>

        {/* 4. ROLE */}
        <div>
            <input 
              type="text" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className='border-2 border-gray-300 rounded-lg ps-2 w-full py-2' 
              placeholder='Write role (e.g. Principal)' 
              required
            />
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          disabled={loading}
          className={`${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 rounded-xl flex justify-center gap-2 active:scale-95 transition-all shadow-lg`}
        >
          <FaPaperPlane className='my-auto'/> 
          {loading ? 'Publishing...' : 'Publish Update'}
        </button>

      </form>
    </div>
  )
}