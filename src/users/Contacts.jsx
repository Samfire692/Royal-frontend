import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaPaperPlane,
  FaGlobe
} from 'react-icons/fa'
import { Footer } from './Footer';

export const Contacts = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      // Fetching everything we discussed from site_settings
      const { data, error } = await supabase
        .from('site_settings')
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching settings:", error.message);
      } else {
        setSettings(data);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const submit = async(e)=> {
    e.preventDefault();
    
    const phonenumber = settings.contact_whatsapp;
    const Fullname = `${fullName}`;
    const Email = `${email}`;
    const Message = `${message}`;

    const encode = encodeURIComponent(`${Fullname}\nMessage: ${Message}`);
    const whatsAppurl = `https://wa.me/${phonenumber}?text=hello my name is ${encode}`;

     window.open(whatsAppurl, "_blank");
    // console.log("whatsapp no", phonenumber)
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-blue-950 uppercase tracking-[0.3em] text-[10px]">Loading Identity...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-8 px-3">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <FaGlobe className="text-blue-600 text-xs" />
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Global Reach</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-blue-950 tracking-tighter uppercase leading-none">
            {settings?.site_name?.split(' ')[0] || 'Royal'} <span className="text-blue-600">Connect</span>
          </h2>
          <p className="text-slate-400 font-medium mt-6 max-w-lg mx-auto">
            Have a question? We’re here to help you navigate your journey at {settings?.site_name}.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          33, Olasheu off Amikanle Road via AIT Road, Alagbado, Lagos. 

          {/* COLUMN 2 & 3: MESSAGE FORM */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-2 md:p-16 shadow-2xl shadow-blue-900/5 border border-white">
            <h3 className="text-3xl font-black text-blue-950 uppercase mb-8 tracking-tight">Send a <span className="text-blue-600">Message</span></h3>
            <form className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <input type="text" placeholder="Full Name" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none font-medium focus:ring-2 focus:ring-blue-600"  onChange={(e)=> setFullname(e.target.value)}/>
              </div>
              <div className="space-y-1">
                <input type="email" placeholder="Email Address" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none font-medium focus:ring-2 focus:ring-blue-600" onChange={(e)=> setEmail(e.target.value)}/>
              </div>
              <textarea rows="6" placeholder="How can we help you?" className="md:col-span-2 w-full bg-slate-50 border-none rounded-3xl px-6 py-4 outline-none font-medium resize-none focus:ring-2 focus:ring-blue-600" onChange={(e)=> setMessage(e.target.value)}></textarea>
             
            <div className='flex justify-center w-full'>
                <button className='bg-green-400 flex justify-center p-2.5 text-white gap-2 rounded-xl lg:w-sm' onClick={submit} type='button' disabled={!fullName ||!message}>
              <FaWhatsapp className='text-2xl'/>
              <span>Chat on Whatsapp</span>
             </button>
            </div>
            </form>
          </div>

        </div>

        {/* MAP SECTION */}
        {settings?.map_embed_url && (
          <div className="mt-16 rounded-[3rem] overflow-hidden h-112.5 shadow-2xl border-8 border-white">
            <iframe 
              src={settings.map_embed_url} 
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000"
              loading="lazy"
            ></iframe>
          </div>
        )}

      </div>

      <div>
        <Footer/>
      </div>
    </div>
  )
}