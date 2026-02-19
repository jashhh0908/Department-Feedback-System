import React from 'react';
import FormBuilder from '../components/FormBuilder.jsx';

const NewFormPage = () => {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold">Create New Form</h1>
                <p className="text-gray-400 mt-2">Build a feedback form and publish it for responses.</p>
            </header>
            <FormBuilder />
        </div>
    );
};

export default NewFormPage;
