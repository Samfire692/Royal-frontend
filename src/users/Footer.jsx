import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaChevronRight
} from 'react-icons/fa';

export const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-950 text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* COLUMN 1: BRANDING */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter uppercase">
              {settings?.site_name?.split(' ')[0] || 'Royal'} <span className="text-blue-500">School</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Empowering the next generation of leaders with excellence in academics, character, and innovation.
            </p>
            <div className="flex gap-4 pt-2">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all border border-white/10"><FaFacebookF /></a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-pink-600 transition-all border border-white/10"><FaInstagram /></a>
              )}
              <a href={`https://wa.me/${settings?.whatsapp_no?.replace(/\D/g, '')}`} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-600 transition-all border border-white/10"><FaWhatsapp /></a>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'News', 'Events', 'Gallery', 'Contacts'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-slate-300 hover:text-white text-sm font-bold flex items-center gap-2 transition-all group">
                    <FaChevronRight className="text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: CONTACT INFO */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Contact</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-blue-500 mt-1" />
                <p className="text-slate-300 text-sm font-medium">{settings?.address || 'Loading Address...'}</p>
              </div>
              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-blue-500" />
                <p className="text-slate-300 text-sm font-medium">{settings?.phone}</p>
              </div>
              <div className="flex items-center gap-4">
                <FaEnvelope className="text-blue-500" />
                <p className="text-slate-300 text-sm font-medium">{settings?.email}</p>
              </div>
            </div>
          </div>

          {/* COLUMN 4: NEWSLETTER / MOTTO */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Our Motto</h4>
            <div className="bg-white/5 p-8 rounded-4xl border border-white/10 relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/30 transition-all"></div>
               <p className="text-white italic font-serif text-lg leading-relaxed relative z-10">
                 "{settings?.school_motto || 'Excellence in every step.'}"
               </p>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            © {currentYear} {settings?.site_name}. ALL RIGHTS RESERVED.
          </p>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            Designed by <span className="text-white">Akinsola Samuel</span>
          </p>
        </div>
      </div>
    </footer>
  )
}