import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';
import { FaUserCircle, FaPhoneAlt, FaEnvelope, FaGraduationCap, FaUserTie } from 'react-icons/fa';

export const AdminForm = () => {
  const navigate = useNavigate();
  const [allAdmission, setAlladmission] = useState([]);
  const [admissionActive, setAdmissionactive] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchForm = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("royal_admissionForm")
      .select("*")
      .order("created_at", { ascending: false }); // Newest first

    if (error) Swal.fire({ icon: "error", title: "Error", text: error.message });
    else setAlladmission(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchForm(); }, []);

  // Reusable Info Item component
  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-2 bg-white/50 rounded-lg">
      <Icon className="text-blue-500 mt-1" />
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h2 className='text-3xl font-extrabold text-slate-900'>Admissions</h2>
            <p className="text-slate-500">{allAdmission.length} total requests</p>
          </div>
          <button className='px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition shadow-lg' onClick={() => navigate(-1)}>Back</button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading dashboard...</div>
        ) : (
          <div className="space-y-3">
            {allAdmission.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
                <div 
                  className={`p-4 cursor-pointer flex justify-between items-center ${admissionActive === item.id ? "bg-blue-600 text-white" : "hover:bg-slate-50"}`}
                  onClick={() => setAdmissionactive(admissionActive === item.id ? null : item.id)}
                >
                  <span className="font-bold text-lg">{item.fullname}</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${admissionActive === item.id ? "bg-blue-400" : "bg-slate-100"}`}>
                    {admissionActive === item.id ? "Hide Details" : "View Details"}
                  </span>
                </div>

                {admissionActive === item.id && (
                  <div className='p-6 bg-slate-50 border-t border-slate-100 animate-in fade-in duration-500'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* Left Side: Photo + Personal */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <img 
                            src={`https://lcvfseppngxjhhborygi.supabase.co/storage/v1/object/public/passports/${item.passport_url}`} 
                            className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
                            alt="passport"
                          />
                          <div>
                            <h3 className="font-bold text-lg">{item.fullname}</h3>
                            <span className="text-blue-600 text-sm font-semibold">{item.applied_class}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2">
                          <InfoItem icon={FaEnvelope} label="Email" value={item.email} />
                          <InfoItem icon={FaPhoneAlt} label="Phone" value={item.phone} />
                        </div>
                      </div>

                      {/* Right Side: Guardian + Academic */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 font-bold text-slate-700"><FaUserTie /> Guardian Info</h4>
                          <div className="grid grid-cols-1 gap-2">
                            <InfoItem icon={FaUserCircle} label="Name" value={item.guardian_name} />
                            <InfoItem icon={FaPhoneAlt} label="Guardian Phone" value={item.guardian_phone} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 font-bold text-slate-700"><FaGraduationCap /> Academic History</h4>
                          <div className="grid grid-cols-1 gap-2">
                            <InfoItem icon={FaGraduationCap} label="Last School" value={item.last_school_attended} />
                            <InfoItem icon={FaGraduationCap} label="Last Class" value={item.last_class_completed} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};