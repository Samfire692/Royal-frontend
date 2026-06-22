import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import SignatureCanvas from 'react-signature-canvas';

export const Profiles = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnSpinner, setBtnspinner] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhonenumber] = useState("");
  const [post, setPost] = useState("");
  const [gender, setGender] = useState("");
  
  const sigPad = useRef({});

  // 1. Fetch Profile Data
  const fetchdata = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data, error } = await supabase
      .from("adminsignup")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("Error" + error.message);
    } else {
      setProfile(data);
      setLoading(false);
    }
  };

  // 2. Load existing signature into canvas
  useEffect(() => {
    if (profile?.signature_url && sigPad.current) {
      const publicUrl = `https://lcvfseppngxjhhborygi.supabase.co/storage/v1/object/public/signatures/${profile.signature_url}`;
      
      const loadImage = async () => {
        try {
          const response = await fetch(publicUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onload = (e) => {
            sigPad.current.fromDataURL(e.target.result);
          };
          reader.readAsDataURL(blob);
        } catch (err) {
          console.error("Signature image could not be loaded:", err);
        }
      };
      loadImage();
    }
  }, [profile]);

  useEffect(() => {
    fetchdata();
  }, []);

  // 3. Update Profile Logic
  const editProfile = async (e) => {
  e.preventDefault();
  setBtnspinner(true);

  try {
    // Get the base64 string directly from the canvas
    let base64Signature = profile.signature_url;

    if (!sigPad.current.isEmpty()) {
      base64Signature = sigPad.current.toDataURL(); // This is the full image text
    }

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("adminsignup")
      .update({
        full_name: fullname || profile.full_name,
        email: email || profile.email,
        phone_number: phoneNumber || profile.phone_number,
        gender: gender || profile.gender,
        post: post || profile.post,
        signature_url: base64Signature // Saving the raw text here
      })
      .eq("id", user.id);

    if (error) throw error;

    Swal.fire({ icon: "success", title: "Success", text: "Profile updated successfully!" });
  } catch (error) {
    Swal.fire({ icon: "error", title: "Update Failed", text: error.message });
  } finally {
    setBtnspinner(false);
  }
};
  if (loading) {
    return (
      <div className='h-80 flex flex-col justify-center place-items-center'>
        <p>Fetching Profile...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className='mt-2 font-bold text-xl text-blue-600'>Edit Profile</h2>
      <form className='form grid md:grid-cols-2 gap-4 py-2'>
        <div className='grid'>
          <label>Full Name</label>
          <input type="text" defaultValue={profile.full_name} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e) => setFullname(e.target.value)} />
        </div>

        <div className='grid'>
          <label>Email</label>
          <input type="text" defaultValue={profile.email} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className='grid'>
          <label>Phone Number</label>
          <input type="text" defaultValue={profile.phone_number} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e) => setPhonenumber(e.target.value)} />
        </div>

        <div className='grid'>
          <label>Admin ID</label>
          <span className='border h-12 p-3 rounded-xl text-slate-400'>{profile.special_id}</span>
        </div>

        <div className='grid'>
          <label>Gender</label>
          <select className='border h-12 p-3 mt-2 rounded-xl' defaultValue={profile.gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className='grid'>
          <label>Post</label>
          <input type="text" defaultValue={profile.post} className='border h-12 p-3 mt-2 border-slate-600' onChange={(e) => setPost(e.target.value)} />
        </div>

        <div className='md:col-span-2 grid'>
          <label className='font-bold mb-2'>Admin Signature</label>
          <div className='border-2 border-slate-600 rounded-xl overflow-hidden bg-white'>
            <SignatureCanvas
              ref={sigPad}
              penColor='black'
              canvasProps={{ width: 500, height: 150, className: 'sigCanvas' }}
            />
          </div>
          <button type="button" className='mt-2 text-sm text-red-500 w-fit' onClick={() => sigPad.current.clear()}>Clear Signature</button>
        </div>

        <button className='lg:w-40 w-full h-10 rounded-xl text-white bg-blue-600' disabled={btnSpinner} onClick={editProfile}>
          {btnSpinner ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};