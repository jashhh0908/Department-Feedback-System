import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deactivateForm, getArchivedForm, getForms, reactivateForm, toggleForm } from '../services/formService.js';
const FormManagement = () => {
    const [forms, setForms] = useState([]);
    const [isBuilding, setIsBuilding] = useState(false);
    const [archived, setIsArchived] = useState(false);
    const fetchForms = async () => {
        try {
            const { data } = await getForms();
            setForms(data.forms);
            setIsArchived(false);
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
    const fetchArchived = async () => {
        try {
            const { data } = await getArchivedForm();
            setForms(data.forms);    
            setIsArchived(true);
            toast.success("Success");
        } catch (error) {
            toast.error('Failed');
        }
    }   
    const renderTable = () => (
        <>
        <div className="flex justify-between items-end mb-6">
            {/*Button For creating forms*/}
            <button 
                onClick={() => setIsBuilding(true)}
                className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-teal-900/20 flex items-center gap-2"
            >
            <p className="font-extrabold leading-none">+</p>Create New Form 
            </button>
            <div className="flex items-center gap-3">
                <button 
                    onClick={archived ? fetchForms : fetchArchived}
                    className="px-4 py-2.5 rounded-lg font-semibold text-sm border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                >
                    {archived ? "View Active Forms" : "View Archived Forms"}
                </button>
            </div>
        </div>
            {/*Table*/}
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
                                    <div className="flex justify-center items-center gap-3 whitespace-nowrap">
                                    {!archived && <button className="px-2 py-1 text-teal-400 rounded text-[13px]  bg-blue-500/10 border-blue-500/20 hover:text-teal-300 text-sm">Edit</button>}
                                    
                                    <button 
                                        onClick={() => form.isArchived ? unarchiveForm(form._id) : archiveForm(form._id, form.title)}
                                        className={`px-2 py-1 rounded text-[13px] text-sm bg-blue-500/10  font-medium transition ${form.isArchived ? 'text-green-500 hover:text-green-300 text-sm' : 'text-red-400 hover:text-red-500 text-sm'}`}                                            
                                        >
                                        {form.isArchived ? "Unarchive" : "Archive"}
                                    </button>
                                    {!archived && <button 
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
    const renderBuilder = () => (
            <div className="p-10 bg-gray-900 border border-gray-800 rounded-xl">
                <button 
                    onClick={() => setIsBuilding(false)}
                    className="text-teal-400 mb-4 hover:underline"
                >
                    Back To List
                </button>
                <p className='text-2xl font-bold'>Create here</p>
            </div>
        )
    return (
        <div className='space-y-6'>
            {isBuilding ? renderBuilder() : renderTable()}
        </div>
    );
};

export default FormManagement;