import React from 'react'
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import { FaEllipsisV, FaExternalLinkAlt, FaEdit, FaSearchPlus} from 'react-icons/fa';

export const EditDelTestimonial = () => {
    const [testimonials, setTestimonials] = useState([]);

    const fetchTestimonials = async () => {
    const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        Swal.fire({ icon: "error", title: "Error", text: error.message })
    } else {
        setTestimonials(data)
    }
}

const handleView = (item) => {
    Swal.fire({
        html: `
      <div class="text-left font-sans">
        <div class="relative w-32 h-32 mx-auto mb-4 group cursor-pointer" id="image-container">
          <img src="${item.image_url}" id="preview-img" class="w-full h-full object-cover rounded-full shadow-md border-4 border-blue-50" />
          <div class="absolute inset-0 flex flex-col items-center justify-center text-blue-700 font-bold bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-all">
            <span class="text-xl">+</span>
            <span class="text-[8px]">Change</span>
          </div>
          <input type="file" id="swal-file-input" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
        </div>

        <div id="swal-name" contenteditable="true" class="text-center text-blue-800 font-bold text-xl mb-1 outline-none border-b border-transparent focus:border-blue-300">${item.name}</div>
        
        <div class="flex justify-center items-center mb-4 gap-1">
            <span class="text-slate-400 text-[10px] mr-2">RATING:</span>
            <div id="swal-rating" class="flex text-yellow-400 cursor-pointer text-lg">
                ${[1, 2, 3, 4, 5].map(star => `
                    <span class="star-icon ${star <= item.rating ? 'text-yellow-400' : 'text-slate-300'}" data-value="${star}">★</span>
                `).join('')}
            </div>
        </div>

        <div id="swal-content" contenteditable="true" class="text-slate-600 italic leading-relaxed text-sm outline-none border-l-4 border-blue-200 p-4 bg-slate-50 rounded-r-lg focus:border-blue-300" style="min-height: 80px;">"${item.content}"</div>

        <div class="flex gap-2 mt-6">
          <button id="update-btn" class="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">Update Review</button>
          <button id="delete-btn" class="px-4 bg-red-50 text-red-600 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all">Delete</button>
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
            const starIcons = document.querySelectorAll('.star-icon');
            
            let newFile = null;
            let currentRating = item.rating;

            // 1. Handle Star Rating Change inside Swal
            starIcons.forEach(star => {
                star.addEventListener('click', (e) => {
                    currentRating = parseInt(e.target.getAttribute('data-value'));
                    starIcons.forEach((s, index) => {
                        s.classList.toggle('text-yellow-400', index < currentRating);
                        s.classList.toggle('text-slate-300', index >= currentRating);
                    });
                });
            });

            // 2. Handle Image Preview
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    newFile = file;
                    previewImg.src = URL.createObjectURL(file);
                }
            });

            // 3. Update Logic
            updateBtn.addEventListener('click', async () => {
                const newName = document.getElementById('swal-name').innerText;
                const newContent = document.getElementById('swal-content').innerText.replace(/"/g, ''); // Remove quotes if user typed them

                Swal.showLoading();
                let finalImageUrl = item.image_url;

                if (newFile) {
                    const fileName = `${Math.random()}.${newFile.name.split('.').pop()}`;
                    const { error: upError } = await supabase.storage.from('testimonial-images').upload(fileName, newFile);
                    if (upError) return Swal.fire('Error', 'Image upload failed', 'error');
                    
                    const { data: pUrl } = supabase.storage.from('testimonial-images').getPublicUrl(fileName);
                    finalImageUrl = pUrl.publicUrl;
                }

                const { error } = await supabase
                    .from('testimonials')
                    .update({ name: newName, content: newContent, rating: currentRating, image_url: finalImageUrl })
                    .eq('id', item.id);

                if (error) {
                    Swal.fire('Error', error.message, 'error');
                } else {
                    Swal.fire('Updated!', 'Testimonial saved', 'success').then(() => fetchTestimonials());
                }
            });

            // 4. Delete Logic
            deleteBtn.addEventListener('click', () => {
                Swal.fire({
                    title: 'Remove Testimonial?',
                    text: "You're about to delete this parent's feedback.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'Yes, delete it'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const { error } = await supabase.from('testimonials').delete().eq('id', item.id);
                        if (error) Swal.fire('Error', error.message, 'error');
                        else Swal.fire('Deleted!', 'Feedback removed.', 'success').then(() => fetchTestimonials());
                    }
                });
            });
        }
    });
};

useEffect(() => {
    fetchTestimonials();
}, [])

  return (
    <div className='bg-slate-200 border-slate-200 border lg:h-[72vh] min-h-[50vh] overflow-y-scroll p-2 rounded-xl mx-auto lg:w-[28vw] md:w-[45vw] '>
        <div className='mb-2'>
            <h2 className='font-bold text-xl'>Existing News</h2>
        </div><hr />
       {testimonials.map((item)=> (
        <div key={item.id} className='p-1 mt-2'>
            <div className='bg-white shadow-sm p-3 flex md:justify-between gap-2 rounded-xl cursor-pointer' onClick={() => handleView(item)}>
                <img src={item.image_url} alt="" className='w-24 h-24 rounded-xl my-auto'/>
                <div className='pt-2 mx-auto text-center'>
                    <p className='font-bold text-xl'>{item.name}</p>
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
