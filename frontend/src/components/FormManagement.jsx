import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deactivateForm, getForms, toggleForm } from '../services/formService.js';

const FormManagement = () => {
    const [forms, setForms] = useState([]);

    const fetchForms = async () => {
        try {
            const { data } = await getForms();
            setForms(data.forms);
        } catch (error) {
            toast.error("Failed to load forms");
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const toggle = async (id) => {
        try {
            await toggleForm(id);
            toast.success(`Status updated`);
            fetchForms(); 
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
    
    return (
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
                                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {form.targetAudience}
                                </span>
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
                                <div className="flex justify-end items-center gap-3 whitespace-nowrap">
                                <button className="text-teal-400 hover:text-teal-300 text-sm">Edit</button>
                                <button 
                                    onClick={() => archiveForm(form._id, form.title)}
                                    className="text-gray-500 hover:text-red-400 text-sm"
                                >
                                    Archive
                                </button>

                                <button 
                                    onClick={() => toggle(form._id)}
                                    className={`${form.isActive ? 'text-amber-500 hover:text-amber-400' : 'text-emerald-500 hover:text-emerald-400'} text-sm font-medium transition`}>
                                        {`${form.isActive ? "Deactivate" : "Activate"}`}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {forms.length === 0 && (
                <div className="p-10 text-center text-gray-500">No active forms found.</div>
            )}
        </div>
    );
};

export default FormManagement;