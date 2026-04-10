import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2'

export const Propietress = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [speech, setSpeech] = useState('');

    // 1. FETCH existing data on load
    useEffect(() => {
        const fetchPropData = async () => {
            const { data, error } = await supabase
                .from('site_settings')
                .select('prop_name, prop_speech, prop_photo_url')
                .eq('id', 1)
                .single();

            if (data) {
                setName(data.prop_name || '');
                setSpeech(data.prop_speech || '');
                setPreview(data.prop_photo_url || null);
            }
        };
        fetchPropData();
    }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let photoUrl = preview; // Keep existing URL if no new file is picked

            // 2. Upload image if a NEW file was selected
            if (file) {
                const fileName = `prop_${Date.now()}.${file.name.split('.').pop()}`;
                const { error: uploadError } = await supabase.storage
                    .from('school-images')
                    .upload(`proprietress/${fileName}`, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('school-images')
                    .getPublicUrl(`proprietress/${fileName}`);
                
                photoUrl = publicUrl;
            }

            // 3. UPDATE the columns directly (FLAT STYLE)
            const { error: dbError } = await supabase
                .from('site_settings')
                .update({ 
                    prop_name: name,
                    prop_speech: speech,
                    prop_photo_url: photoUrl
                })
                .eq('id', 1);

            if (dbError) throw dbError;

            Swal.fire('Saved!', 'Proprietress profile updated successfully.', 'success');
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2">
            <h2 className='font-bold text-xl mb-4'>Proprietress Profile</h2>

            <form onSubmit={handleUpload} className='flex flex-col lg:flex-row gap-5'>
                {/* Image Section */}
                <div className='my-auto'>
                    <div className='relative border border-dashed h-50 w-60 rounded-xl mx-auto flex justify-center items-center overflow-hidden bg-slate-50'>
                        {preview ? (
                            <img src={preview} alt="Proprietress" className="h-full w-full object-cover" />
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
                </div>

                {/* Text Section */}
                <div className='w-full'>
                    <div className='grid mb-3'>
                        <label className='font-bold text-sm'>Proprietress Name:</label>
                        <input 
                            type="text" 
                            value={name} // Shows existing name
                            onChange={(e) => setName(e.target.value)}
                            className='border h-10 p-3 rounded outline-blue-500'
                        />
                    </div>

                    <div className='grid mb-3'>
                        <label className='font-bold text-sm'>Proprietress Speech:</label>
                        <textarea 
                            value={speech} // Shows existing speech
                            onChange={(e) => setSpeech(e.target.value)}
                            className='border h-32 p-3 rounded outline-blue-500 resize-none'
                        ></textarea>
                    </div>

                    <button 
                        disabled={loading}
                        className='w-full py-2.5 bg-blue-600 hover:bg-black text-white rounded-xl font-bold transition-all'
                    >
                        {loading ? "Saving..." : "Update Profile"}
                    </button>
                </div>
            </form>
        </div>
    )
}