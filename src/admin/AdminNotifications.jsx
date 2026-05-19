import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';
import { FaArrowLeft, FaCheck, FaTimes, FaUserCheck, FaUndo } from 'react-icons/fa';

export const AdminNotifications = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('pending');

    const fetchRequests = async () => {
    setLoading(true);
    try {
        // We use the arrow syntax 'assigned_class(...)' to join the tables
        // Replace 'class_name' with whatever your column name is in royalclassrooms
        const { data, error } = await supabase
            .from('teachersignup')
            .select(`
                id, 
                full_name, 
                special_id, 
                class_teacher_status,
                pending_class_request,
                assigned_class,
                pending_room:royalclassrooms!teachersignup_pending_class_request_fkey (class_name),
                assigned_room:royalclassrooms!teachersignup_assigned_class_fkey (class_name)
            `);

        if (error) throw error;

        const relevantData = data.filter(req => 
            req.class_teacher_status === 'pending' || 
            req.class_teacher_status === 'approved'
        );
        setRequests(relevantData);
    } catch (error) {
        console.error("Fetch Error:", error.message);
    } finally {
        setLoading(false);
    }
};

    const handleAction = async (id, name, classId, action) => {
        const isApprove = action === 'approved';
        const isRevoke = action === 'pending';
        
        try {
            // CRITICAL FIX: We must send the UUID (classId), not the text name
            const { error } = await supabase
                .from('teachersignup')
                .update({
                    class_teacher_status: action,
                    assigned_class: isApprove ? classId : null,
                    // If revoking, we move the ID back to pending
                    pending_class_request: isRevoke ? classId : (isApprove ? null : null)
                })
                .eq('id', id);

            if (error) throw error;

            Swal.fire({
                icon: 'success',
                title: isApprove ? 'Approved!' : (isRevoke ? 'Decision Reversed' : 'Declined'),
                text: `${name} has been updated successfully.`,
                timer: 2000,
                showConfirmButton: false
            });
            fetchRequests(); 
        } catch (error) {
            console.error("Update Error:", error.message);
            Swal.fire("Update Error", "Database rejected this format. Ensure the request is a valid UUID ID.", "error");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredData = requests.filter(req => req.class_teacher_status === view);

    return (
        <div className="p-4 lg:p-8 bg-slate-50 min-h-screen text-black">
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 bg-white shadow-sm rounded-full hover:bg-slate-200 transition-all"
                >
                    <FaArrowLeft />
                </button>
                <h2 className="text-2xl font-bold">Class Teacher Requests</h2>
            </div>

            <div className="flex gap-4 mb-6 border-b border-slate-200">
                <button 
                    onClick={() => setView('pending')}
                    className={`pb-2 px-1 font-bold transition-all ${view === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400'}`}
                >
                    Pending ({requests.filter(r => r.class_teacher_status === 'pending').length})
                </button>
                <button 
                    onClick={() => setView('approved')}
                    className={`pb-2 px-1 font-bold transition-all ${view === 'approved' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400'}`}
                >
                    Approved ({requests.filter(r => r.class_teacher_status === 'approved').length})
                </button>
            </div>

            <div>
                {loading ? (
                    <p className="text-slate-500 animate-pulse">Checking records...</p>
                ) : filteredData.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl text-center shadow-sm border border-dashed border-slate-300">
                        <p className="text-slate-400">No {view} requests found. ☕</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredData.map((req) => (
                            <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">{req.full_name}</h3>
                                    <small className="text-slate-500 block">{req.special_id}</small>
                                    
                                    <div className="mt-2 inline-block text-xs px-3 py-1 rounded-full font-semibold bg-blue-100 text-blue-700">
                                     {req.class_teacher_status === 'approved' 
                                     ? `Assigned to: ${req.assigned_room?.class_name || 'Loading...'}` 
                                     : `Requesting: ${req.pending_room?.class_name || 'Loading...'}`
                                     }
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    {req.class_teacher_status === 'pending' ? (
                                        <>
                                            <button 
                                                onClick={() => handleAction(req.id, req.full_name, req.pending_class_request, 'approved')}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all"
                                            >
                                                <FaCheck /> Approve
                                            </button>
                                            <button 
                                                onClick={() => handleAction(req.id, req.full_name, req.pending_class_request, 'none')}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold transition-all"
                                            >
                                                <FaTimes /> Decline
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col md:flex-row gap-3 items-center">
                                            <div className="flex items-center gap-2 text-blue-600 font-bold px-4 py-2 bg-blue-50 rounded-xl border border-green-100">
                                                <FaUserCheck /> Approved
                                            </div>
                                            <button 
                                                onClick={() => handleAction(req.id, req.full_name, req.assigned_class, 'pending')}
                                                className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm font-semibold transition-colors"
                                            >
                                                <FaUndo /> Reverse Decision
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};