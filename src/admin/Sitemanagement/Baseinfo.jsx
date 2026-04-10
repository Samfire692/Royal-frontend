import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';

export const Baseinfo = () => {
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        base_curriculum_desc: '',
        base_facilities_desc: '',
        base_teachers_desc: '',
        contact_whatsapp: '',
        contact_phone1: '',
        contact_phone2: '',
        link_facebook: '',
        link_telegram: '',
        link_instagram: '',
        link_twitter: ''
    });

    // 1. FETCH existing data on load
    useEffect(() => {
        const fetchBaseInfo = async () => {
            const { data } = await supabase
                .from('site_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (data) {
                // Only update keys that exist in our local state
                const updatedData = {};
                Object.keys(formData).forEach(key => {
                    updatedData[key] = data[key] || '';
                });
                setFormData(updatedData);
            }
        };
        fetchBaseInfo();
    }, []);

    const handleChange = (e, key) => {
        setFormData({ ...formData, [key]: e.target.value });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 2. UPDATE: Send the entire formData object to the specific columns
            const { error } = await supabase
                .from('site_settings')
                .update(formData) // This maps keys to columns automatically
                .eq('id', 1);

            if (error) throw error;

            Swal.fire('Success', 'Base Information Synced!', 'success');
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='mb-2'>
                <h2 className='text-blue-800 font-bold text-xl'>Base Settings</h2> 
            </div>
            <hr />

            <div className='mt-2'>
                <h2 className='font-bold text-xl'>Facilities & Contact</h2>
                <form onSubmit={handleUpload}>
                    <div className='grid lg:grid-cols-3 gap-3 mt-2'>
                        <div className='grid'>
                            <label className='font-bold text-sm'>Curriculum</label>
                            <textarea 
                                value={formData.base_curriculum_desc}
                                onChange={(e) => handleChange(e, 'base_curriculum_desc')}
                                className='border h-20 p-3 rounded-xl outline-none'
                            ></textarea>
                        </div>

                        <div className='grid'>
                            <label className='font-bold text-sm'>Facilities</label>
                            <textarea 
                                value={formData.base_facilities_desc}
                                onChange={(e) => handleChange(e, 'base_facilities_desc')}
                                className='border h-20 p-3 rounded-xl outline-none'
                            ></textarea>
                        </div>

                        <div className='grid'>
                            <label className='font-bold text-sm'>Teachers</label>
                            <textarea 
                                value={formData.base_teachers_desc}
                                onChange={(e) => handleChange(e, 'base_teachers_desc')}
                                className='border h-20 p-3 rounded-xl outline-none'
                            ></textarea>
                        </div>
                    </div>

                    <div className='mt-6 p-4 bg-blue-600 rounded-2xl'>
                        <h3 className='text-white font-bold mb-3 text-sm uppercase'>Contact & Socials</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white'>
                            <div className='grid'>
                                <label className='text-blue-100 text-xs font-bold'>WhatsApp</label>
                                <input type="text" value={formData.contact_whatsapp} onChange={(e) => handleChange(e, 'contact_whatsapp')} className='h-10 px-3 rounded-lg outline-none border border-white mt-2'/>
                            </div>

                            <div className='grid'>
                                <label className='text-blue-100 text-xs font-bold'>Phone (Line 1)</label>
                                <input type="text" value={formData.contact_phone1} onChange={(e) => handleChange(e, 'contact_phone1')} className='h-10 px-3 rounded-lg outline-none border border-white mt-2'/>
                            </div>

                            <div className='grid'>
                                <label className='text-blue-100 text-xs font-bold'>Facebook</label>
                                <input type="text" value={formData.link_facebook} onChange={(e) => handleChange(e, 'link_facebook')} className='h-10 px-3 rounded-lg outline-none border border-white mt-2'/>
                            </div>

                            <div className='grid'>
                                <label className='text-blue-100 text-xs font-bold'>Twitter (X)</label>
                                <input type="text" value={formData.link_twitter} onChange={(e) => handleChange(e, 'link_twitter')} className='h-10 px-3 rounded-lg outline-none border border-white mt-2'/>
                            </div>

                            <div className='grid'>
                                <label className='text-blue-100 text-xs font-bold'>Telegram</label>
                                <input type="text" value={formData.link_telegram} onChange={(e) => handleChange(e, 'link_telegram')} className='h-10 px-3 rounded-lg outline-none border border-white mt-2'/>
                            </div>

                            <div className='grid'>
                                <label className='text-blue-100 text-xs font-bold'>Instagram</label>
                                <input type="text" value={formData.link_instagram} onChange={(e) => handleChange(e, 'link_instagram')} className='h-10 px-3 rounded-lg outline-none border border-white mt-2'/>
                            </div>
                        </div>
                    </div>

                    <div className='text-center mt-6'>
                        <button disabled={loading} className='w-full py-4 bg-blue-800 hover:bg-black text-white font-bold rounded-2xl'>
                            {loading ? "Syncing..." : "Save All Information"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};