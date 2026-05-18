import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';
import { FaArrowLeft, FaCheck, FaTimes, FaUserCheck, FaClock } from 'react-icons/fa';

export const AdminNotifications = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    // ✅ Track which tab we are on
    const [activeTab, setActiveTab] = useState('pending');

    const fetchRequests = async () => {
        setLoading(true);
        // ✅ Now we fetch both 'pending' and 'approved' teachers
        const { data, error } = await supabase
            .from('teachersignup')
            .select('id, full_name, pending_class_request, assigned_class, email, class_teacher_status')
            .in('class_teacher_status', ['pending', 'approved']);

        if (!error) setRequests(data || []);
        setLoading(false);
    };

    const handleAction = async (id, name, className, action) => {
        const isApprove = action === 'approved';
        
        const { error } = await supabase
            .from('teachersignup')
            .update({
                class_teacher_status: action,
                assigned_class: isApprove ? className : null,
                pending_class_request: null 
            })
            .eq('id', id);

        if (!error) {
            Swal.fire({
                icon: 'success',
                title: isApprove ? 'Approved!' : 'Declined',
                text: `${name} has been updated successfully.`,
                timer: 2000,
                showConfirmButton: false
            });
            fetchRequests(); 
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // ✅ Filter data based on the active tab
    const filteredRequests = requests.filter(req => req.class_teacher_status === activeTab);

    return (
        <div className="p-4 lg:p-8 bg-slate-50 min-h-screen text-black">
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 bg-white shadow-sm rounded-full hover:bg-slate-200 transition-all"
                >
                    <FaArrowLeft />
                </button>
                <h2 className="text-2xl font-bold">Class Teacher Management</h2>
            </div>

            {/* ✅ TAB SWITCHER - Kept it clean to match your style */}
            <div className='flex gap-4 mb-8 border-b border-slate-200'>
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`pb-2 px-2 flex items-center gap-2 font-semibold transition-all ${activeTab === 'pending' ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-400"}`}
                >
                    <FaClock /> Pending
                </button>
                <button 
                    onClick={() => setActiveTab('approved')}
                    className={`pb-2 px-2 flex items-center gap-2 font-semibold transition-all ${activeTab === 'approved' ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-400"}`}
                >
                    <FaUserCheck /> Approved
                </button>
            </div>

            <div className="">
                {loading ? (
                    <p className="text-slate-500 animate-pulse">Checking for requests...</p>
                ) : filteredRequests.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-dashed border-slate-300">
                        <p className="text-slate-400">No {activeTab} teachers at the moment. ☕</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredRequests.map((req) => (
                            <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">{req.full_name}</h3>
                                    <p className="text-sm text-slate-500">{req.email}</p>
                                    <div className={`mt-2 inline-block text-xs px-3 py-1 rounded-full font-semibold ${activeTab === 'pending' ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}>
                                        {activeTab === 'pending' ? `Requesting: ${req.pending_class_request}` : `Assigned to: ${req.assigned_class}`}
                                    </div>
                                </div>

                                {/* ✅ Only show buttons if the teacher is PENDING */}
                                {activeTab === 'pending' && (
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <button 
                                            onClick={() => handleAction(req.id, req.full_name, req.pending_class_request, 'approved')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all"
                                        >
                                            <FaCheck /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(req.id, req.full_name, req.pending_class_request, 'none')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold transition-all"
                                        >
                                            <FaTimes /> Decline
                                        </button>
                                    </div>
                                )}
                                
                                {/* ✅ Show a "Revoke" button for Approved teachers just in case the Admin made a mistake */}
                                {activeTab === 'approved' && (
                                    <button 
                                        onClick={() => handleAction(req.id, req.full_name, null, 'none')}
                                        className="text-red-500 text-sm font-semibold hover:underline"
                                    >
                                        Remove Teacher
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};