import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { deactivateForm, getArchivedForm, getForms, reactivateForm, toggleForm } from '../services/formService.js';
import FormBuilder from './FormBuilder.jsx';
import FormTable from './FormTable.jsx';
const FormManagement = () => {
    const [forms, setForms] = useState([]);
    const [isBuilding, setIsBuilding] = useState(false);
    const [isArchived, setIsArchived] = useState(false);
    const fetchForms = async () => {
        try {
            const { data } = await getForms();
            setForms(data.forms);
            setIsArchived(false);
        } catch (error) {
            console.error("Error while fetching forms: ", error);
            toast.error("Failed to load forms");
        }
    };
    
    const fetchArchived = async () => {
        try {
            const { data } = await getArchivedForm();
            setForms(data.forms);    
            setIsArchived(true);
        } catch (error) {
            toast.error('Failed');
        }
    }   
    useEffect(() => {
        fetchForms();
    }, []);

    const renderTable = () => (
        <FormTable 
            forms={forms}
            fetchForms={fetchForms} 
            setIsBuilding={setIsBuilding}
            fetchArchived={fetchArchived}
            isArchived={isArchived}
        />
        )
    const renderBuilder = () => (
        <FormBuilder 
            onBack={() => setIsBuilding(false)} 
            fetchForms={fetchForms} 
        />
    );
    return (
        <div className='space-y-6'>
            {isBuilding ? renderBuilder() : renderTable()}
        </div>
    );
};

export default FormManagement;