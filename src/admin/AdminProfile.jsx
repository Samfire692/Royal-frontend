import React from 'react'
import { supabase } from '../supabaseClient'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import profilepic from '../assets/Images/admin profile pic.jfif'
import { FaCamera } from 'react-icons/fa';
import { ProfileCard } from './Profile/ProfileCard';

export const AdminProfile = () => {

  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchdata = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("adminsignup")
      .select("*")
      .eq("id", user.id)

    if (error) {
      console.log("Error" + error.message)
    } else {
      setProfile(data);
      setLoading(false);
    }
  }

  // --- NEW UPLOAD LOGIC ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Instant Preview for vibes
    setPreviewUrl(URL.createObjectURL(file));

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // 2. Unique filename so it doesn't overwrite
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 3. Upload to your 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 4. Get the Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 5. Save the link to your adminsignup table
      const { error: updateError } = await supabase
        .from("adminsignup")
        .update({ profile_pic_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      Swal.fire({ icon: 'success', title: 'Nice!', text: 'Profile picture updated', timer: 2000 });
      fetchdata(); // Sync everything

    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, [])

  if (loading) {
    return (
      <div className='h-[80vh] flex justify-center place-items-center flex-col'>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg>
        <p className='mt-2'>Fetching data . . .</p>
      </div>
    )
  }

  return (
    <div className='pb-12 h-fit'>
      <div className='mb-2'>
        <h2 className='text-3xl font-bold'>Profile</h2>
      </div><hr />

      {profile.map((item) => (
        <section id='Profile' key={item.id}>
          <div className='Profile'>
            <div className='cover bg-blue-500 h-35'></div>

            <div className='px-4 flex flex-col md:flex-row gap-5'>
              <div className='shadow-sm -my-10 p-3 bg-white text-center lg:min-w-[20vw] md:min-w-[30vw]'>
                <div className='flex justify-center relative'>
                  {/* Image source logic: Preview > Database URL > Default Asset */}
                  <img 
                    src={previewUrl || item.profile_pic_url || profilepic} 
                    alt="Admin" 
                    className={`mx-auto lg:my-0 -mt-18 md:my-0 w-30 h-30 object-cover rounded-full shadow-sm border-4 border-blue-600/50 bg-white ${uploading ? 'opacity-50' : ''}`} 
                  />
                  
                  <div className='absolute lg:my-[11vh] md:my-[7vh] lg:left-[11.8vw] left-[50.3vw] md:left-[17.8vw]'>
                    {/* The button wraps the input so clicking the camera triggers the file picker */}
                    <label className='bg-blue-500 p-1.5 w-7.5 h-7.5 rounded-full border-2 border-white text-white flex items-center justify-center cursor-pointer'>
                      {uploading ? (
                        <span className="text-[10px]">...</span>
                      ) : (
                        <FaCamera size={14} />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className='hidden' 
                        onChange={handleImageChange}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <p className='mt-4 mb-1 font-bold text-xl text-blue-800'>{item.full_name}</p>
                  <small className='text-slate-600'>{item.special_id}</small>

                  <div className='grid grid-cols-3 md:grid-cols-1 gap-2 text-center md:text-start mt-4'>
                    <div className='border border-slate-500/30 md:border-t-0 md:border-l-0 md:border-r-0 md:rounded rounded-2xl lg:w-full min-w-23 h-20 md:h-fit p-3.5 flex flex-col md:flex-row justify-between'>
                      <p className='font-bold mb-1 text-blue-600 text-xxl'>Status</p>
                      <span>Active</span>
                    </div>

                    <div className='border border-slate-500/30 md:border-t-0 md:border-l-0 md:border-r-0 md:rounded rounded-2xl lg:w-full min-w-23 h-20 md:h-fit p-3.5 flex flex-col md:flex-row justify-between'>
                      <p className='font-bold mb-1 text-blue-600 text-xxl'>Role</p>
                      <span className='capitalize'>{item.role}</span>
                    </div>

                    <div className='border border-slate-500/30 md:border-t-0 md:border-l-0 md:border-r-0 md:rounded rounded-2xl lg:w-full min-w-23 h-20 md:h-fit p-3.5 flex flex-col md:flex-row justify-between'>
                      <p className='font-bold mb-1 text-blue-600 text-xxl'>Joined</p>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-10 md:-my-10 w-full'>
                <ProfileCard />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}