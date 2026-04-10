import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';

export const Stats = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        stat_years: '',
        stat_pass_rate: '',
        stat_graduates: ''
    });

    // 1. FETCH existing data when page loads
    useEffect(() => {
        const fetchStats = async () => {
            // FIXED: Ask for actual columns, not key_name
            const { data, error } = await supabase
                .from('site_settings')
                .select('stat_years, stat_pass_rate, stat_graduates')
                .eq('id', 1)
                .single();

            if (data) {
                // FIXED: Direct mapping because it's a flat row now
                setStats({
                    stat_years: data.stat_years || '',
                    stat_pass_rate: data.stat_pass_rate || '',
                    stat_graduates: data.stat_graduates || ''
                });
            }
            if (error) console.error("Fetch error:", error.message);
        };

        fetchStats();
    }, []);

    const handleChange = (e, key) => {
        setStats({ ...stats, [key]: e.target.value });
    };

    // 2. SAVE data to Supabase
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);

        try {
            // FIXED: Standard update for the flat table
            const { error } = await supabase
                .from('site_settings')
                .update({ 
                 stat_years: stats.stat_years,
                 stat_pass_rate: stats.stat_pass_rate, 
                 stat_graduates: stats.stat_graduates
                })
                .eq('id', 1);

            if (error) throw error;

            Swal.fire({
                icon: 'success',
                title: 'Stats Updated!',
                text:"Updated Successfully"
            });
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className='font-bold text-xl'>Stats</h2>

            <form onSubmit={handleSubmit}> 
               <div className='grid lg:grid-cols-3 lg:gap-4 mt-2'>
                  <div className='mb-2'>
                    <label>Years of Excellence :</label>
                    <input 
                        type="text" 
                        value={stats.stat_years} 
                        onChange={(e) => handleChange(e, 'stat_years')}
                        className='border h-9 p-3 w-full rounded outline-blue-500'
                    />
                  </div>

                  <div className='mb-2'>
                    <label>Exam Pass Rate :</label>
                    <input 
                        type="text" 
                        value={stats.stat_pass_rate} 
                        onChange={(e) => handleChange(e, 'stat_pass_rate')}
                        className='border h-9 p-3 w-full rounded outline-blue-500'
                    />
                  </div>

                  <div className='mb-2'>
                    <label>Graduated Students :</label>
                    <input 
                        type="text" 
                        value={stats.stat_graduates} 
                        onChange={(e) => handleChange(e, 'stat_graduates')}
                        className='border h-9 p-3 w-full rounded outline-blue-500'
                    />
                  </div>
               </div>

                <div className='text-center'>
                    <button 
                        disabled={loading}
                        className='lg:w-50 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors'
                    >
                        {loading ? "Saving..." : "Upload"}
                    </button>
                </div>
            </form>
        </div>
    );
};