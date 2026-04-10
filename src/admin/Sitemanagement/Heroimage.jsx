import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2'

export const Heroimage = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    // 1. FETCH the existing image URL when the component loads
    useEffect(() => {
        const fetchHeroImage = async () => {
            const { data, error } = await supabase
                .from('site_settings')
                .select('hero_image_url')
                .eq('id', 1)
                .single();

            if (data && data.hero_image_url) {
                setPreview(data.hero_image_url);
            }
            if (error) console.error("Error fetching hero image:", error.message);
        };
        fetchHeroImage();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); 
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return Swal.fire('Wait!', 'Please select a new image first.', 'info');

        setUploading(true);
        try {
            // 2. Upload Image to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `hero_${Date.now()}.${fileExt}`; // Use Date.now for unique names
            const filePath = `uploads/${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('school-images') 
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 3. Get the Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('school-images')
                .getPublicUrl(filePath);

            // 4. Update the Flat Table column
            const { error: dbError } = await supabase
                .from('site_settings')
                .update({ 
                  hero_image_url: publicUrl 
                })
                .eq('id', 1);

            if (dbError) throw dbError;

            Swal.fire('Success', 'Hero image updated successfully!', 'success');
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className='mt-3'>
            <div>
                <h2 className='font-bold text-xl'>Hero Image</h2>
            </div>

            <form onSubmit={handleUpload}>
                <div className='relative border border-dashed h-50 w-70 mt-2 rounded-xl mx-auto flex justify-center place-items-center overflow-hidden bg-slate-50'>
                    {preview ? (
                        <img src={preview} alt="Hero" className="h-full w-full object-cover" />
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
                        disabled={uploading}
                        className='lg:w-50 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-bold shadow-sm'
                    >
                        {uploading ? "Uploading..." : "Update Hero Image"}
                    </button>
                </div>
            </form><br />
        </div>
    )
}