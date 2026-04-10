import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import { FaPlus } from 'react-icons/fa';

export const Aboutimg = () => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  // 1. FETCH existing image on load
  useEffect(() => {
    const fetchAboutImage = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('about_image_url')
        .eq('id', 1)
        .single();

      if (data?.about_image_url) {
        setPreview(data.about_image_url);
      }
      if (error) console.error("Error fetching about image:", error.message);
    };
    fetchAboutImage();
  }, []);

  // 2. Handle selection & local preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // 3. The actual upload logic
  const handleUpload = async (e) => {
    e.preventDefault(); 
    if (!file) return Swal.fire('Wait!', 'Please select a new image first.', 'info');

    try {
      setUploading(true);

      // Filename & Path (Using Date.now() for uniqueness)
      const fileExt = file.name.split('.').pop();
      const fileName = `about_${Date.now()}.${fileExt}`;
      const filePath = `about/${fileName}`;

      // Upload to Supabase Bucket
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // Save to DB (Flat Column Update)
      const { error: dbError } = await supabase
        .from('site_settings')
        .update({ 
         about_image_url: publicUrl 
        })
        .eq('id', 1);

      if (dbError) throw dbError;

      Swal.fire({
        icon: 'success',
        title: 'About Image Updated!',
        text: 'The school profile image is now live.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='mt-3'>
      <div>
        <h2 className='font-bold text-xl'>About Image</h2>
      </div>

      <form onSubmit={handleUpload}>
        <div className='relative border border-dashed h-50 w-70 mt-2 rounded-xl mx-auto flex justify-center place-items-center overflow-hidden bg-slate-50'>
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <FaPlus className='text-5xl text-slate-400'/>
          )}
          
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className='absolute inset-0 opacity-0 cursor-pointer'
          />
        </div>

        <div className='text-center mt-2'>
          <button 
            type="submit"
            disabled={uploading}
            className='lg:w-50 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-bold'
          >
            {uploading ? "Uploading..." : "Upload About Image"}
          </button>
        </div>
      </form><br />
    </div>
  );
};