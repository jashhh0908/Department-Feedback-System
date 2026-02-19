import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getArchivedForm, getForms } from '../services/formService.js';
import FormTable from './FormTable.jsx';

const FormManagement = () => {
    const [forms, setForms] = useState([]);
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
        } catch {
            toast.error('Failed');
        }
    }   
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchForms();
        }, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <FormTable 
            forms={forms}
            fetchForms={fetchForms} 
            fetchArchived={fetchArchived}
            isArchived={isArchived}
        />
    );
};

export default FormManagement;
