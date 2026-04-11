import React, { useState, useEffect } from 'react'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'
import { FaPlus, FaSpinner, FaUser, FaUsers, FaGraduationCap } from 'react-icons/fa'
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

  // --- LOGIC: FETCHING CLASSES (UNTOUCHED) ---
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

  // --- LOGIC: IMAGE HANDLING (UNTOUCHED) ---
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

  // --- LOGIC: SUBMISSION (UNTOUCHED) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!imageFile) {
        Swal.fire('Missing Photo', 'Please upload a passport photo first!', 'warning');
        setLoading(false);
        return;
      }
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('passports')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('royal_admissionForm')
        .insert([{
          ...formData,
          passport_url: filePath,
          created_at: new Date()
        }]);

      if (insertError) throw insertError;

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
      Swal.fire({ icon: 'error', title: 'Submission Failed', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 py-10 px-4'>
      <div className='max-w-4xl mx-auto'>
        
        {/* Form Header */}
        <div className='text-center mb-10'>
          <img src={schoolLogo} alt="Logo" className='w-20 mx-auto mb-4 drop-shadow-lg' />
          <h2 className='text-3xl md:text-4xl font-black text-blue-950 uppercase tracking-tighter'>Admission Form</h2>
          <p className='text-slate-500 font-medium'>Royal Ambassadors Schools Online Enrollment</p>
        </div>

        <form onSubmit={handleSubmit} className='bg-white shadow-2xl shadow-blue-900/10 rounded-[2.5rem] border border-slate-100 overflow-hidden'>
          
          <div className='p-6 md:p-12'>
            
            {/* SECTION 1: PERSONAL INFO */}
            <div className='flex items-center gap-2 mb-8 border-b pb-4'>
                <FaUser className='text-blue-600 text-xl'/>
                <h3 className='text-xl font-black text-blue-900 uppercase'>Personal Information</h3>
            </div>

            <div className='flex flex-col lg:flex-row gap-10 mb-12'>
              {/* Passport Upload Area */}
              <div className='w-full lg:w-48 shrink-0'>
                <div className='relative group'>
                  <div className='w-40 h-48 mx-auto border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 transition-all group-hover:border-blue-400'>
                    <input type="file" accept="image/*" onChange={handleImageChange} className='absolute inset-0 opacity-0 cursor-pointer z-10' required />
                    {imgPreview ? (
                      <img src={imgPreview} alt="preview" className='w-full h-full object-cover' />
                    ) : (
                      <div className='text-center text-slate-400'>
                        <FaPlus className='text-3xl mx-auto mb-2' />
                        <span className='text-[10px] font-bold uppercase'>Upload Passport</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className='text-[10px] text-center mt-3 text-red-500 font-bold'>* White background required</p>
              </div>

              {/* Personal Details Inputs */}
              <div className='grow grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='md:col-span-2'>
                  <label className='block text-xs font-black text-blue-900 uppercase mb-2'>Fullname (Surname First)</label>
                  <input type="text" required onChange={(e) => setFormData({...formData, fullname: e.target.value})} className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 transition-all' placeholder='e.g. Okoro, Emeka Musa'/>
                </div>
                <div>
                  <label className='block text-xs font-black text-blue-900 uppercase mb-2'>Email Address</label>
                  <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800' placeholder='example@mail.com'/>
                </div>
                <div>
                  <label className='block text-xs font-black text-blue-900 uppercase mb-2'>Phone Number</label>
                  <input type="tel" required onChange={(e) => setFormData({...formData, phone: e.target.value})} className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800' placeholder='0800 000 0000'/>
                </div>
              </div>
            </div>

            {/* SECTION 2: GUARDIAN INFO */}
            <div className='flex items-center gap-2 mb-8 border-b pb-4'>
                <FaUsers className='text-blue-600 text-xl'/>
                <h3 className='text-xl font-black text-blue-900 uppercase'>Guardian Information</h3>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-12'>
              <div>
                <label className='block text-xs font-black text-blue-900 uppercase mb-2'>Guardian's Fullname</label>
                <input type="text" required onChange={(e) => setFormData({...formData, guardian_name: e.target.value})} className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500' />
              </div>
              <div>
                <label className='block text-xs font-black text-blue-900 uppercase mb-2'>Relationship</label>
                <input type="text" required onChange={(e) => setFormData({...formData, guardian_relationship: e.target.value})} className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500' placeholder='e.g. Father' />
              </div>
              <div>
                <label className='block text-xs font-black text-blue-900 uppercase mb-2'>Guardian's Phone</label>
                <input type="tel" required onChange={(e) => setFormData({...formData, guardian_phone: e.target.value})} className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500' />
              </div>
              <div>
                <label className='block text-xs font-black text-blue-900 uppercase mb-2'>Residential Address</label>
                <input type="text" required onChange={(e) => setFormData({...formData, address: e.target.value})} className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500' />
              </div>
            </div>

            {/* SECTION 3: ACADEMIC DETAILS */}
            <div className='flex items-center gap-2 mb-8 border-b pb-4'>
                <FaGraduationCap className='text-blue-600 text-xl'/>
                <h3 className='text-xl font-black text-blue-900 uppercase'>Academic Details</h3>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-12'>
              <div className='md:col-span-2'>
                <label className='block text-xs font-black text-blue-900 uppercase mb-2'>Class Applying For</label>
                <select required onChange={(e) => setFormData({...formData, applied_class: e.target.value})} className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none'>
                  <option value="">-- Select Target Class --</option>
                  {classes.map((items) => (
                    <option key={items.id} value={items.class_name}>{items.class_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-xs font-black text-blue-900 uppercase mb-2'>Last Class Completed</label>
                <input type="text" required onChange={(e) => setFormData({...formData, last_class_completed: e.target.value})} className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500' />
              </div>
              <div>
                <label className='block text-xs font-black text-blue-900 uppercase mb-2'>Last School Attended</label>
                <input type="text" required onChange={(e) => setFormData({...formData, last_school_attended: e.target.value})} className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500' />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading}
              className='w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-200 transition-all flex justify-center items-center gap-3 uppercase tracking-widest active:scale-95 disabled:opacity-70'>
              {loading ? <FaSpinner className='animate-spin text-2xl'/> : "Submit Application 🎓"}
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}