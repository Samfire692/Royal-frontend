import React, { useState, useEffect } from 'react'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'
import { FaPlus, FaSpinner } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const AdmissionForm = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [imgPreview, setImgpreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    guardian_name: '',
    guardian_relationship: '',
    guardian_phone: '',
    address: '',
    applied_class: '',
    last_class_completed: '',
    last_school_attended: ''
  });

  const fetchClass = async () => {
    const { data, error } = await supabase
      .from('royalclassrooms')
      .select('*')
      .order('created_at', { ascending: "true" })

    if (error) {
      Swal.fire({ icon: "warning", title: "oops", text: "failed to fetch: " + error.message })
    } else {
      setClasses(data);
    }
  }

  useEffect(() => {
    fetchClass();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
    Swal.fire('Too Big!', 'Please upload a passport less than 2MB', 'error');
    e.target.value = ""; 
    return;
  }

    if (file) {
      setImageFile(file);
      setImgpreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Check if image exists
      if (!imageFile) {
        Swal.fire('Missing Photo', 'Please upload a passport photo first!', 'warning');
        setLoading(false);
        return;
      }

      // 2. Prepare Unique Filename (to avoid overwriting)
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 3. UPLOAD TO STORAGE BUCKET
      const { error: uploadError } = await supabase.storage
        .from('passports') // Make sure this matches your bucket name exactly!
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 4. INSERT INTO DATABASE TABLE
      const { error: insertError } = await supabase
        .from('royal_admissionForm')
        .insert([{
          ...formData,
          passport_url: filePath, // Saving the REAL filename, not "pending_upload"
          created_at: new Date()
        }]);

      if (insertError) throw insertError;

      // 5. SUCCESS!
      Swal.fire({ 
        icon: 'success', 
        title: 'Application Sent!', 
        text: 'Welcome to Royal Ambassadors Schools. Redirecting...' 
      });
      
      setTimeout(() => {
        navigate("/admission");
      }, 2000);

      setImgpreview(null);
      setImageFile(null);

    } catch (error) {
      console.error("Submission Error:", error.message);
      Swal.fire({ 
        icon: 'error', 
        title: 'Submission Failed', 
        text: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-2 bg-blue-400 text-white'>
      <div className='text-center py-2 mb-2'>
        <h2 className='font-bold text-3xl'>Admission Form</h2>
      </div>

      <section id='form'>
        <div className='form flex justify-center'>
          <form onSubmit={handleSubmit} className='p-3 border rounded-xl'>
            <div className='text-center flex gap-3'>
              <img src={schoolLogo} alt="" width={'80px'} className='rounded-full h-18' style={{ boxShadow: '1px 1px 15px blue' }} />
              <h2 className='font-bold text-2xl my-auto mx-auto'>ROYAL AMBASSADORS SCHOOLS</h2>
            </div><br />

            <h2 className='text-xl font-bold mb-2'>Personal Info: </h2>
            <div className='flex flex-col lg:flex-row-reverse gap-2'>
              {/* PASSPORT SECTION */}
              <div>
                <h2 className='text-center text-xl font-bold'>Passport</h2>
                <div className='addImg border p-1 rounded-xl m-auto w-50 h-50 flex place-items-center justify-center relative overflow-hidden'>
                  <div className='text-center cursor-pointer'>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className='absolute inset-0 opacity-0 cursor-pointer z-10' required 
                    />
                    
                    {imgPreview ? (
                      <img src={imgPreview} alt="preview" className='w-full h-full object-cover rounded-xl' />
                    ) : (
                      <button type="button" className='text-5xl'><FaPlus className='cursor-pointer' /></button>
                    )}
                  </div>
                </div>
                <p className='text-[10px] text-center mt-1 italic'>* Use white background</p>
              </div>

              {/* Personal Info Inputs */}
              <div className='px-2 my-auto w-full'>
                <div className='mb-2'>
                  <label className='font-bold text-sm'>Fullname:</label>
                  <input type="text" required onChange={(e) => setFormData({...formData, fullname: e.target.value})} className='border w-full h-9 rounded ps-1 text-black' placeholder='Surname, First, Last'/>
                </div>
                <div className='mb-2'>
                  <label className='font-bold text-sm'>Email:</label>
                  <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} className='border w-full h-9 rounded ps-1 text-black' placeholder='email@gmail.com'/>
                </div>
                <div className='mb-2'>
                  <label className='font-bold text-sm'>Phone Number:</label>
                  <input type="tel" required onChange={(e) => setFormData({...formData, phone: e.target.value})} className='border w-full h-9 rounded ps-1 text-black' placeholder='0801...'/>
                </div>        
              </div>
            </div><br />

            {/* Guardian Info */}
            <h2 className='text-xl font-bold mb-2'>Guardian Info: </h2>
            <div className='px-2'>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  <div className='mb-2'>
                    <label className='font-bold text-sm'>Guardian Fullname:</label>
                    <input type="text" required onChange={(e) => setFormData({...formData, guardian_name: e.target.value})} className='border w-full h-9 rounded ps-1 text-black' />
                  </div>
                  <div className='mb-2'>
                    <label className='font-bold text-sm'>Relationship</label>
                    <input type="text" required onChange={(e) => setFormData({...formData, guardian_relationship: e.target.value})} className='border w-full h-9 rounded ps-1 text-black' />
                  </div>
               </div>
               <div className='mb-2'>
                <label className='font-bold text-sm'>Guardian Phone:</label>
                <input type="tel" required onChange={(e) => setFormData({...formData, guardian_phone: e.target.value})} className='border w-full h-9 rounded ps-1 text-black' />
               </div>
               <div className='mb-2'>
                <label className='font-bold text-sm'>Address:</label>
                <input type="text" required onChange={(e) => setFormData({...formData, address: e.target.value})} className='border w-full h-9 rounded ps-1 text-black' />
               </div>
            </div><br />

            {/* Academic Details */}
            <h2 className='text-xl font-bold mb-2'>Academic Details: </h2>
            <div className='px-2'>
                <div className='mb-2'>
                  <label className='font-bold text-sm'>Class Applying For: </label>
                  <select required onChange={(e) => setFormData({...formData, applied_class: e.target.value})} className='border w-full p-2 rounded text-black'>
                    <option value="">-- Select a Class --</option>
                    {classes.map((items) => (
                      <option key={items.id} value={items.class_name}>{items.class_name}</option>
                    ))}
                  </select>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  <div className='mb-2'>
                    <label className='font-bold text-sm'>Last Class Completed:</label>
                    <input type="text" required onChange={(e) => setFormData({...formData, last_class_completed: e.target.value})} className='border w-full h-9 rounded ps-1 text-black' />
                  </div>
                  <div className='mb-2'>
                    <label className='font-bold text-sm'>Last School Attended:</label>
                    <input type="text" required onChange={(e) => setFormData({...formData, last_school_attended: e.target.value})} className='border w-full h-9 rounded ps-1 text-black' />
                  </div>
                </div>
            </div>
                
            <div className='mt-5'>
              <button 
                disabled={loading}
                className='py-3 w-full bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg'>
                {loading ? <FaSpinner className='animate-spin'/> : "Submit Application 🎓"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}