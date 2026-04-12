import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';

export const EditDelEvents = () => {
  const [events, setEvents] = useState([]);
  
  // Update these to match your official names
  const TABLE_NAME = "royal_events";
  const BUCKET_NAME = "event_images";

 const fetchEvents = async () => {
  const { data, error } = await supabase
    .from("royal_events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  } else {
    // This is the magic part: turn the file name into a full URL
    const formattedData = data.map(item => {
      if (item.image_url && !item.image_url.startsWith('http')) {
        const { data: pUrl } = supabase.storage
          .from('event-images')
          .getPublicUrl(item.image_url);
        
        return { ...item, image_url: pUrl.publicUrl };
      }
      return item;
    });

    setEvents(formattedData);
  }
}

  const handleView = (item) => {
    Swal.fire({
      html: `
        <div class="text-left font-sans">
          <div class="relative w-40 h-40 mx-auto mb-4 group cursor-pointer" id="image-container">
            <img src="${item.image_url}" id="preview-img" class="w-full h-full object-cover rounded-xl shadow-md opacity-60" />
            <div class="absolute inset-0 flex flex-col items-center justify-center text-blue-700 font-bold">
              <span class="text-3xl">+</span>
              <span class="text-[10px] uppercase">Change Image</span>
            </div>
            <input type="file" id="swal-file-input" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
          </div>

          <div id="swal-title" contenteditable="true" class="text-blue-900 font-black text-xl mb-2 outline-none border-b-2 border-transparent focus:border-blue-300 uppercase">${item.title}</div>
          
          <div class="flex justify-end mb-3">
             <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">${new Date(item.created_at).toLocaleDateString()}</span>
          </div>

          <div id="swal-content" contenteditable="true" class="text-slate-700 leading-relaxed text-sm outline-none border-2 border-slate-100 p-3 rounded-2xl focus:border-blue-300" style="min-height: 120px;">${item.content}</div>

          <div class="flex gap-2 mt-6">
            <button id="update-btn" class="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg">Update Event</button>
            <button id="delete-btn" class="px-4 bg-red-50 text-red-600 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Delete</button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'rounded-[2rem]' },
      didOpen: () => {
        const fileInput = document.getElementById('swal-file-input');
        const previewImg = document.getElementById('preview-img');
        const updateBtn = document.getElementById('update-btn');
        const deleteBtn = document.getElementById('delete-btn');
        let newFile = null;

        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            newFile = file;
            previewImg.src = URL.createObjectURL(file);
            previewImg.classList.remove('opacity-60');
          }
        });

        updateBtn.addEventListener('click', async () => {
          const newTitle = document.getElementById('swal-title').innerText;
          const newContent = document.getElementById('swal-content').innerText;

          Swal.showLoading();

          let finalImageUrl = item.image_url;

          if (newFile) {
            const fileName = `${Math.random()}.${newFile.name.split('.').pop()}`;
            const { error: upError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, newFile);
            
            if (upError) return Swal.showValidationMessage(`Upload failed: ${upError.message}`);
            
            const { data: pUrl } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
            finalImageUrl = pUrl.publicUrl;
          }

          const { error } = await supabase
            .from(TABLE_NAME)
            .update({ title: newTitle, content: newContent, image_url: finalImageUrl })
            .eq('id', item.id);

          if (error) {
            Swal.fire('Error', error.message, 'error');
          } else {
            Swal.fire('Updated!', 'Event details changed sharp-sharp!', 'success').then(() => fetchEvents());
          }
        });

        deleteBtn.addEventListener('click', () => {
          Swal.fire({
            title: 'Delete this event?',
            text: "Omo, you no go fit recover am o!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete!',
            customClass: { popup: 'rounded-3xl' }
          }).then(async (result) => {
            if (result.isConfirmed) {
              const { error } = await supabase.from(TABLE_NAME).delete().eq('id', item.id);
              if (error) Swal.fire('Error', error.message, 'error');
              else Swal.fire('Deleted!', 'Event has been removed.', 'success').then(() => fetchEvents());
            }
          });
        });
      }
    });
  };

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div>
      <div className='bg-white border-slate-100 border shadow-xl lg:h-[72vh] min-h-[50vh] overflow-y-scroll p-4 rounded-4xl mx-auto lg:w-[28vw] md:w-[45vw]'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='font-black text-blue-950 uppercase tracking-tight'>Active Events</h2>
          <span className='bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full font-bold'>{events.length}</span>
        </div>
        <hr className='mb-4' />
        
        {events.length === 0 ? (
          <p className='text-center text-slate-400 mt-10 text-sm'>No events found yet.</p>
        ) : (
          events.map((item) => (
            <div key={item.id} className='mb-3'>
              <div 
                className='bg-slate-50 hover:bg-blue-50 border border-slate-100 p-3 flex gap-4 rounded-2xl cursor-pointer transition-all group' 
                onClick={() => handleView(item)}
              >
                <img src={item.image_url} alt="" className='w-20 h-20 rounded-xl object-cover my-auto shadow-sm group-hover:scale-105 transition-transform'/>
                <div className='overflow-hidden flex flex-col justify-center'>
                  <p className='font-black text-blue-900 truncate uppercase text-sm'>{item.title}</p>
                  <p className='text-[10px] text-slate-500 line-clamp-2 mt-1 leading-tight'>{item.content}</p>
                  <div className='mt-2'>
                    <span className='text-[9px] font-bold text-slate-400 tracking-tighter'>
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}