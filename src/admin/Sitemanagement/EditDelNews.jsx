import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import { FaEllipsisV, FaExternalLinkAlt, FaEdit, FaSearchPlus} from 'react-icons/fa';

export const EditDelNews = () => {

    const [news, setNews] = useState([]);
    const [editDel, setEditdel]= useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const fetchNews = async()=> {
       const{data, error} = await supabase
       .from("news")
       .select("*")
       .order("created_at", {ascending:true})

       if(error){
         Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
         })
       }else{
        setNews(data)
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
            <span class="text-[10px]">Change Image</span>
          </div>
          <input type="file" id="swal-file-input" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
        </div>

        <div id="swal-title" contenteditable="true" class="text-blue-700 font-bold text-xl mb-2 outline-none border-b border-transparent focus:border-blue-300">${item.title}</div>
        
        <div class="flex justify-between items-center mb-3">
           <span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase">${item.club}</span>
           <span class="text-slate-400 text-xs">${new Date(item.created_at).toLocaleDateString()}</span>
        </div>

        <div id="swal-content" contenteditable="true" class="text-slate-700 leading-relaxed text-sm outline-none border p-2 rounded-lg focus:border-blue-300" style="min-height: 100px;">${item.content}</div>

        <div class="flex gap-2 mt-6">
          <button id="update-btn" class="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">Update News</button>
          <button id="delete-btn" class="px-4 bg-red-50 text-red-600 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all">Delete</button>
        </div>
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: { popup: 'rounded-3xl' },
    didOpen: () => {
      const fileInput = document.getElementById('swal-file-input');
      const previewImg = document.getElementById('preview-img');
      const updateBtn = document.getElementById('update-btn');
      const deleteBtn = document.getElementById('delete-btn');
      let newFile = null;

      // 1. Handle Image Preview Change
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          newFile = file;
          previewImg.src = URL.createObjectURL(file);
          previewImg.classList.remove('opacity-60'); // Show clearly once selected
        }
      });

      // 2. Handle Update Logic
      updateBtn.addEventListener('click', async () => {
        const newTitle = document.getElementById('swal-title').innerText;
        const newContent = document.getElementById('swal-content').innerText;

        Swal.showLoading();

        let finalImageUrl = item.image_url;

        // If a new image was picked, upload it first
        if (newFile) {
          const fileName = `${Math.random()}.${newFile.name.split('.').pop()}`;
          const { error: upError } = await supabase.storage.from('news-images').upload(fileName, newFile);
          if (upError) return Swal.showValidationMessage(`Upload failed: ${upError.message}`);
          
          const { data: pUrl } = supabase.storage.from('news-images').getPublicUrl(fileName);
          finalImageUrl = pUrl.publicUrl;
        }

        const { error } = await supabase
          .from('news')
          .update({ title: newTitle, content: newContent, image_url: finalImageUrl })
          .eq('id', item.id);

        if (error) {
          Swal.fire('Error', error.message, 'error');
        } else {
          Swal.fire('Updated!', 'News updated successfully', 'success').then(() => fetchNews());
        }
      });

      // 3. Handle Delete Logic
      deleteBtn.addEventListener('click', () => {
        Swal.fire({
          title: 'Delete this news?',
          text: "Omo, you no go fit recover am o!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Yes, delete!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const { error } = await supabase.from('news').delete().eq('id', item.id);
            if (error) Swal.fire('Error', error.message, 'error');
            else Swal.fire('Deleted!', 'Item cleared.', 'success').then(() => fetchNews());
          }
        });
      });
    }
  });
};
    useEffect(()=> {
        fetchNews();
    }, [])

  return (
     <div className='bg-slate-200 border-slate-200 border lg:h-[72vh] min-h-[50vh] overflow-y-scroll p-2 rounded-xl mx-auto lg:w-[28vw] md:w-[45vw]'>
        <div className='mb-2'>
            <h2 className='font-bold text-xl'>Existing News</h2>
        </div><hr />
       {news.map((item)=> (
        <div key={item.id} className='p-1 mt-2'>
            <div className='bg-white shadow-sm p-3 flex md:justify-between gap-2 rounded-xl' onClick={() => handleView(item)}>
                <img src={item.image_url} alt="" className='w-24 h-24 rounded-xl my-auto'/>
                <div className='pt-2'>
                    <p className='font-bold text-xl'>{item.title}</p>
                    <p className='w-52 py-1 h-8 overflow-hidden'>{item.content}</p>
                    <p className='flex gap-2'><span>{item.club}</span> 
                    <span>
                     {new Date(item.created_at).toLocaleDateString('en-US', {
                     day: 'numeric',
                     month: 'short',
                     year: 'numeric'
                     })}
                    </span></p>
                </div>
            </div>
        </div>
       ))} <br />
    </div>
  )
}
