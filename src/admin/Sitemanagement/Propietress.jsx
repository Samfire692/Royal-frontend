import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2'
import { FaPlus, FaUserTie, FaSave, FaCamera } from 'react-icons/fa'

export const Propietress = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', speech: '' });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // Preview state

    // Handle File Selection & Preview
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // Create local URL for preview
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let photoUrl = null;
            if (file) {
                const fileName = `prop_${Date.now()}.png`;
                await supabase.storage.from('site-assets').upload(`leadership/${fileName}`, file);
                const { data } = supabase.storage.from('site-assets').getPublicUrl(`leadership/${fileName}`);
                photoUrl = data.publicUrl;
                await supabase.from('site_settings').upsert({ key_name: 'prop_image_url', value_text: photoUrl });
            }

            if(formData.name) await supabase.from('site_settings').upsert({ key_name: 'prop_name', value_text: formData.name });
            if(formData.speech) await supabase.from('site_settings').upsert({ key_name: 'prop_speech', value_text: formData.speech });

            Swal.fire('Success', 'Profile Updated!', 'success');
        } catch (err) {
            Swal.fire('Error', 'Update failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl pb-10">
            <div className="flex items-center gap-2 mb-8">
                <div className="bg-blue-600 p-2 rounded-lg"><FaPlus className="text-white text-xs" /></div>
                <h2 className='font-bold text-xl text-slate-800'>Proprietress Profile</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* PHOTO PREVIEW SECTION */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <FaUserTie className="text-4xl text-slate-300" />
                        )}
                        <label className="absolute bottom-0 w-full bg-black/50 py-1 flex justify-center cursor-pointer hover:bg-black/70 transition-all">
                            <FaCamera className="text-white text-xs" />
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Official Portrait</p>
                </div>

                {/* NAME */}
                <div className="space-y-1">
                    <label className='text-xs font-black text-slate-400 uppercase ml-2'>Full Name & Title</label>
                    <input 
                        type="text" 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className='border-2 border-slate-100 w-full h-12 px-4 rounded-2xl focus:border-blue-500 outline-none transition-all font-semibold' 
                        placeholder="Mrs. Blessing Christopher"
                    />
                </div>

                {/* SPEECH */}
                <div className="space-y-1">
                    <label className='text-xs font-black text-slate-400 uppercase ml-2'>Welcome Message</label>
                    <textarea 
                        onChange={(e) => setFormData({...formData, speech: e.target.value})}
                        className='border-2 border-slate-100 w-full h-44 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all text-sm'
                        placeholder="Start typing the speech here..."
                    ></textarea>
                </div>

                <button 
                    disabled={loading}
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all flex justify-center items-center'
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Update Profile"}
                </button>
            </form>
        </div>
    )
}