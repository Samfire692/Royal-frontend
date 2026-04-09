import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import { FaCloudUploadAlt, FaImages } from 'react-icons/fa';

export const Aboutimg = () => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      // 1. Local Preview
      setPreview(URL.createObjectURL(file));

      // 2. Filename & Path (Saved in 'about' folder)
      const fileExt = file.name.split('.').pop();
      const fileName = `about_section_${Math.random()}.${fileExt}`;
      const filePath = `about/${fileName}`;

      // 3. Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 4. Get Public URL
      const { data } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // 5. Save to DB with 'about_image_url' key
      const { error: dbError } = await supabase
        .from('site_settings')
        .upsert({ 
          key_name: 'about_image_url', 
          value_text: publicUrl 
        }, { onConflict: 'key_name' });

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
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-4">
      <div className="flex items-center gap-2 mb-4">
        <FaImages className="text-blue-600" />
        <h4 className="font-bold text-slate-800 text-sm">About School Image</h4>
      </div>

      <div className={`relative h-48 w-full rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${preview ? 'border-blue-400' : 'border-slate-200 bg-slate-50'}`}>
        
        {preview ? (
          <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        ) : null}

        <div className="relative z-10 flex flex-col items-center">
          {uploading ? (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          ) : (
            <>
              <FaCloudUploadAlt className="text-4xl text-slate-300 mb-2" />
              <p className="text-[10px] font-bold text-slate-500 uppercase">Change About Image</p>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      </div>
      
      <p className="text-[9px] text-slate-400 mt-3 italic text-center">
        This image appears next to the school history section.
      </p>
    </div>
  );
};