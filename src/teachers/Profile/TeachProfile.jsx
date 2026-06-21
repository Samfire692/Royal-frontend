import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2';
import SignatureCanvas from 'react-signature-canvas';

export const TeachProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnSpinner, setBtnspinner] = useState(false);
  const sigPad = useRef({}); // Reference for the drawing pad

  // States for form inputs
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhonenumber] = useState("");
  const [post, setPost] = useState("");
  const [gender, setGender] = useState("");

  const fetchdata = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("teachersignup")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("Error" + error.message);
    } else {
      setProfile(data);
      setFullname(data.full_name || "");
      setEmail(data.email || "");
      setPhonenumber(data.phone_number || "");
      setPost(data.post || "");
      setGender(data.gender || "");
      setLoading(false);
    }
  };

  const editProfile = async (e) => {
    e.preventDefault();
    setBtnspinner(true);

    const { error } = await supabase
      .from("teachersignup")
      .update({
        full_name: fullname,
        email: email,
        phone_number: phoneNumber,
        gender: gender,
        post: post
      })
      .eq("id", profile?.id);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Success", "Profile updated successfully", "success");
    }
    setBtnspinner(false);
  };

  const handleSaveSignature = async () => {
    if (sigPad.current.isEmpty()) {
      Swal.fire("Warning", "Please draw a signature first", "warning");
      return;
    }

    setBtnspinner(true);
    // Convert canvas to base64 string and save directly to DB
    const dataURL = sigPad.current.toDataURL();

    const { error } = await supabase
      .from("teachersignup")
      .update({ signature_url: dataURL })
      .eq("id", profile.id);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Success", "Signature saved successfully", "success");
      fetchdata();
    }
    setBtnspinner(false);
  };

  useEffect(() => { fetchdata(); }, [])

  if (loading) {
    return (
      <div className='h-80 flex flex-col justify-center place-items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg>
        <p className='mt-2'>Fetching Profile</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className='mt-2 font-bold text-xl text-blue-600'>Edit Profile</h2>
      <form className='form grid md:grid-cols-2 gap-4 py-2' onSubmit={editProfile}>
        <div className='grid'><label>Full Name</label><input type="text" defaultValue={profile.full_name} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e) => setFullname(e.target.value)} /></div>
        <div className='grid'><label>Email</label><input type="text" defaultValue={profile.email} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e) => setEmail(e.target.value)} /></div>
        <div className='grid'><label>Phone Number</label><input type="text" defaultValue={profile.phone_number} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e) => setPhonenumber(e.target.value)} /></div>
        <div className='grid'><label>Admin ID</label><span className='border h-12 p-3 rounded-xl text-slate-400 bg-slate-50'>{profile.special_id}</span></div>
        <div className='grid'>
            <label>Gender</label>
            <select className='border h-12 p-3 mt-2 rounded-xl' defaultValue={profile.gender} onChange={(e) => setGender(e.target.value)}>
              <option disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
        </div>
        <div className='grid'><label>Post</label><input type="text" defaultValue={profile.post} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e) => setPost(e.target.value)} /></div>
        
        {/* Signature Pad Section */}
        <div className='md:col-span-2 grid mt-4'>
            <label className="font-bold">Teacher's Signature</label>
            {profile.signature_url && (
                <div className="my-2">
                    <p className="text-sm text-gray-500">Current Saved Signature:</p>
                    <img src={profile.signature_url} alt="Signature" className='w-40 h-20 border border-slate-400 object-contain mt-1'/>
                </div>
            )}
            <div className="border-2 border-slate-600 rounded-xl overflow-hidden bg-white">
                <SignatureCanvas 
                    ref={sigPad}
                    penColor='black'
                    canvasProps={{ width: 800, height: 200, className: 'w-full h-40' }} 
                />
            </div>
            <div className="flex gap-2 mt-2">
                <button type='button' className='bg-red-500 text-white px-4 py-2 rounded-xl' onClick={() => sigPad.current.clear()}>Clear</button>
                <button type='button' className='bg-blue-600 text-white px-4 py-2 rounded-xl' onClick={handleSaveSignature} disabled={btnSpinner}>Save Signature</button>
            </div>
        </div>

        <button className='lg:w-40 w-full h-10 rounded-xl text-white bg-blue-600 flex justify-center items-center' disabled={btnSpinner} type="submit">
          {btnSpinner ? "Processing..." : "Update Profile"}
        </button>
      </form>
    </div>
  )
}