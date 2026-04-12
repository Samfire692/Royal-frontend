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

  useEffect(() => {
    const fetchSettings = async () => {
      // Fetching everything we discussed from site_settings
      const { data, error } = await supabase
        .from('site_settings')
        .select(`
          whatsapp_no, 
          email, 
          phone, 
          address, 
          facebook_url, 
          instagram_url, 
          twitter_url, 
          map_embed_url,
          site_name
        `)
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
          
          {/* COLUMN 1: DIRECT INFO */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-blue-950 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
               Quick Info <div className="h-px grow bg-slate-200"></div>
            </h3>

            {/* Phone */}
            <div className="bg-white p-6 rounded-4xl shadow-xl shadow-blue-900/5 flex items-center gap-5 border border-white">
              <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg"><FaPhoneAlt /></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Call Us</p>
                <p className="text-blue-950 font-bold text-sm">{settings?.phone}</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-4xl shadow-xl shadow-blue-900/5 flex items-center gap-5 border border-white">
              <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg"><FaEnvelope /></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mail Us</p>
                <p className="text-blue-950 font-bold text-sm">{settings?.email}</p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white p-6 rounded-4xl shadow-xl shadow-blue-900/5 flex items-center gap-5 border border-white">
              <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg"><FaMapMarkerAlt /></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Our Campus</p>
                <p className="text-blue-950 font-bold text-sm">{settings?.address}</p>
              </div>
            </div>

            {/* SOCIALS */}
            <div className="pt-6 flex gap-4 justify-center lg:justify-start">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><FaFacebookF /></a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all"><FaInstagram /></a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-all"><FaTwitter /></a>
              )}
              <a href={`https://wa.me/${settings?.whatsapp_no?.replace(/\D/g, '')}`} target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"><FaWhatsapp /></a>
            </div>
          </div>

          {/* COLUMN 2 & 3: MESSAGE FORM */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-2 md:p-16 shadow-2xl shadow-blue-900/5 border border-white">
            <h3 className="text-3xl font-black text-blue-950 uppercase mb-8 tracking-tight">Send a <span className="text-blue-600">Message</span></h3>
            <form className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <input type="text" placeholder="Full Name" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none font-medium focus:ring-2 focus:ring-blue-600" />
              </div>
              <div className="space-y-1">
                <input type="email" placeholder="Email Address" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none font-medium focus:ring-2 focus:ring-blue-600" />
              </div>
              <textarea rows="6" placeholder="How can we help you?" className="md:col-span-2 w-full bg-slate-50 border-none rounded-3xl px-6 py-4 outline-none font-medium resize-none focus:ring-2 focus:ring-blue-600"></textarea>
             <a href={`https://wa.me/${settings?.whatsapp_no?.replace(/\D/g, '')}`} target="_blank" 
             rel="noreferrer"
             className="bg-emerald-600 text-white font-black uppercase text-[10px] tracking-[0.3em] px-12 py-5 rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 w-full md:w-auto"
>
  Chat on WhatsApp <FaWhatsapp className="text-lg" />
</a>
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