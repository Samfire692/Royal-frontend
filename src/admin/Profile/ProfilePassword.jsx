import React from 'react'
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';

export const ProfilePassword = () => {

  const [btnSpinner, setBtnspinner]= useState(false);
  const [oldPassword, setOldpassword]= useState("");
  const [newPassword, setNewpassword]= useState("");
  const [confirmPassword, setConfirmpassword]= useState("");

  const passwordEdit = async (e) => {
  e.preventDefault();
  setBtnspinner(true);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (authError) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Incorrect old password",
      });
      setBtnspinner(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "New passwords do not match!",
      });
      setBtnspinner(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: updateError.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password updated successfully!",
      });
      setOldpassword("");
      setNewpassword("");
      setConfirmpassword("");
    }
    }  finally {
     setBtnspinner(false);
     }
    };
  return (
    <div>
      <form action="" className='py-4 flex flex-col gap-3'>
        <div className='grid'>
          <label htmlFor="">Old Password</label>
          <input type="text" className='border h-12 p-3 text-black mt-2' value={oldPassword} onChange={(e)=>setOldpassword(e.target.value)} required/>
        </div>

        <div className='grid'>
          <label htmlFor="">New Password</label>
          <input type="text" className='border h-12 p-3 text-black mt-2' value={newPassword} onChange={(e)=> setNewpassword(e.target.value)} required/>
        </div>

        <div className='grid'>
          <label htmlFor="">Confirm New Password</label>
          <input type="text" className='border h-12 p-3 text-black mt-2' value={confirmPassword} onChange={(e)=> setConfirmpassword(e.target.value)} required/>
        </div>

        <div>
          <button className='lg:w-40 w-full h-10 rounded-xl text-white bg-blue-600' disabled={!oldPassword, !newPassword, !confirmPassword} onClick={passwordEdit}>{btnSpinner ?  <span className='flex justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="22" height="22" fill="none"/><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14"/><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29"/><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43"/><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57"/><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71"/><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86"/><circle cx="12" cy="21.5" r="1.5" fill="currentColor"/><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"/></g></svg></span> : "Update"}</button>
        </div>
      </form>
    </div>
  )
}
