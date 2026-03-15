import React from 'react';
import FormBuilder from '../components/FormBuilder.jsx';
import { useParams } from 'react-router-dom';

const NewFormPage = () => {
    const { formId } = useParams();
    const isEditMode = Boolean(formId);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Form' : 'Create New Form'}</h1>
                <p className="text-gray-400 mt-2">
                    {isEditMode
                        ? 'Update form details and save your changes.'
                        : 'Build a feedback form and publish it for responses.'}
                </p>
            </header>
            <FormBuilder formId={formId} />
        </div>
    );
};

export default NewFormPage;
