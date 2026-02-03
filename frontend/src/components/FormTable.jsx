import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { deactivateForm, reactivateForm, toggleForm } from '../services/formService.js';

const FormTable = ({ forms, fetchForms, setIsBuilding, fetchArchived, isArchived }) => {
    
    useEffect(() => {
        fetchForms();
    }, []);

    const toggle = async (id) => {
        try {
            await toggleForm(id);
            toast.success(`Status updated`);
            isArchived ? fetchArchived() : fetchForms();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const archiveForm = async (id, title) => {
        if (window.confirm(`Archive "${title}"? It will be removed from the main list.`)) {
            try {
                await deactivateForm(id);
                toast.success("Form archived");
                fetchForms();
            } catch (error) {
                toast.error("Failed to archive form");
            }
        }
    };
    
    const unarchiveForm = async (id) => {
        try {
            await reactivateForm(id);
            toast.success("Form unarchived");
            fetchArchived();
        } catch (error) {
            toast.error("Failed to unarchive form");
            console.error("Error while unarchiving: ", error);
        }
    }
    
    const handleCopyLink = (formId) => {
    const url = `${window.location.origin}/fill-form/${formId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
};
    return (
        <>
        <div className="flex justify-between items-end mb-6">
            <button 
                onClick={() => setIsBuilding(true)}
                className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-teal-900/20 flex items-center gap-2"
            >
            <p className="font-extrabold leading-none">+</p>Create New Form 
            </button>
            <div className="flex items-center gap-3">
                <button 
                    onClick={isArchived ? fetchForms : fetchArchived}
                    className="px-4 py-2.5 rounded-lg font-semibold text-sm border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                >
                    {isArchived ? "View Active Forms" : "View Archived Forms"}
                </button>
            </div>
        </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr className="bg-gray-800/50 text-gray-400  text-sm uppercase tracking-widest border-b border-gray-800">
                            <th className="p-4 font-medium">Form Title</th>
                            <th className="p-4 font-medium">Target</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {forms.map((form) => (
                            <tr key={form._id} className="hover:bg-gray-800/30 transition">
                                <td className="p-4 font-medium">{form.title}</td>
                                <td className="p-4">
                                    {form.targetAudience === 'student' && <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-teal-500/20 text-teal-400">
                                        Student
                                    </span>}
                                    {form.targetAudience === 'alumni' && <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400">
                                        Alumni
                                    </span>}
                                    {form.targetAudience === 'employer' && <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-400">
                                        Employer
                                    </span>}
                                </td>   
                                <td className="p-4">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-tight border ${
                                        form.isActive 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                        : 'bg-gray-800 text-gray-500 border-gray-700'
                                    }`}>
                                        <span className={`${form.isActive ? 'bg-emerald-500' : 'bg-gray-600'}`}></span>
                                        {form.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </div>  
                                </td>
                                <td className="p-4 text-right space-x-4">
                                    <div className="flex justify-center items-center gap-3 whitespace-nowrap">
                                    {!isArchived && (
                                        <>
                                                <button 
                                                    onClick={() => handleCopyLink(form._id)}
                                                    className="px-2 py-1 text-blue-400 rounded text-[13px] bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition flex items-center gap-1"
                                                >
                                                    <span className="text-lg leading-none">🔗</span> Share
                                                </button>
                                        <button className="px-2 py-1 text-teal-400 rounded text-[13px]  bg-blue-500/10 border-blue-500/20 hover:text-teal-300 text-sm">Edit</button>
                                        </>
                                    )} 
                                    <button 
                                        onClick={() => form.isArchived ? unarchiveForm(form._id) : archiveForm(form._id, form.title)}
                                        className={`px-2 py-1 rounded text-[13px] text-sm bg-blue-500/10  font-medium transition ${form.isArchived ? 'text-green-500 hover:text-green-300 text-sm' : 'text-red-400 hover:text-red-500 text-sm'}`}                                            
                                        >
                                        {form.isArchived ? "Unarchive" : "Archive"}
                                    </button>
                                    {!isArchived && <button 
                                        onClick={() => toggle(form._id)}
                                        className={`px-2 py-1 rounded text-[13px] ${form.isActive ? 'bg-blue-500/10 text-amber-500 hover:text-amber-400' : 'bg-blue-500/10 text-emerald-500 hover:text-emerald-400'} text-sm font-medium transition`}>
                                            {`${form.isActive ? "Deactivate" : "Activate"}`}
                                        </button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {forms.length === 0 && (
                    <div className="p-10 text-center text-gray-500">No forms found.</div>
                )}
            </div>
        </>
    )
}

export default FormTable

